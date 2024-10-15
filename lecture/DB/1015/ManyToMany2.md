## 팔로우 기능 구현
### 프로필 페이지
- 팔로우 기능은 프로필 페이지에서 구현되는 경우가 많음
- 따라서 각 회원의 개인 프로필 페이지 먼저 구현하기
1. url
```py
# accounts/urls.py

urlpatterns = [
	...
	path('profile/<str:username>/', views.profile, name='profile'),
	# '<str:username>/' 과 같이 변수로만 이루어진 url의 경우
	# 가장 하단에 위치하는 것이 좋다.
]
	```
2. view
```py
# accounts/views.py

from django.contrib.auth import get_user_model

def profile(request, username):
	User = get_user_model()	   # 유저 정보 받기
	person = User.objects.get(username=username)	# person의 프로필로 이동
	context = {
		'person':person,
	}
	return render(request, 'accounts/profile.html', context)
```
3. template
```html
<!-- accounts/profile.html -->

<body>
  <h1>{{ person.username }}님의 프로필</h1>

  <hr>

  <h2>{{ person.username }}가 작성한 게시글</h2>
  {% for article in person.article_set.all %}
    <div>{{ article.title }}</div>
  {% endfor %}

  <hr>
  
  <h2>{{ person.username }}</h2>
  {% for comment in person.comment_set.all %}
    <div>{{ comment.content}}</div>
  {% endfor %}

  <hr>

  <h2>{{ person.username }}가 좋아요 한 게시글</h2>
  {% for article in person.like_articles.all %}
    <div>{{ article.title }}</div>
  {% endfor %}
</body>
```
4. 프로필 페이지로 이동할 수 있는 링크 작성
```html
<!-- articles/index.html -->

<!-- 내 프로필로 이동 -->
<a href="{% url 'accounts:profile' user.username %}">내 프로필</a>

<!-- 작성자 프로필로 이동 -->
<p>작성자: <a href="{% url 'accounts:profile' article.user.username %}">{{ article.user }}</a></p>
<!-- username이랑 user랑 무슨 차이 ? -->
```

### 모델 관계 설정
**User(M) - User(N)**
- 0명 이상의 회원은 0명 이상의 회원과 관련
- 회원은 0명 이상의 팔로워를 가질 수 있고 0명 이상의 다른 회원들을 팔로잉 할 수 있음

**모델 관계 설정**
- ManyToManyField 작성
```py
# accounts/models.py

class User(AbstractUser):
	followings = models.ManyToManyField('self', symmetrical=False, related_name='followers')
```
- 참조: 내가 팔로우하는 사람들(followings)
- 역참조: 상대방 입장에서 나는 팔로워 중 한 명(followers)

### 기능 구현
1. url
```py
# accounts/urls.py

urlpatterns = [
	...,
	path('<int:user_pk>/follow/', views.follow, name='follow'),
]
```
2. view
```py
# accounts/views.py

@login_required
def follow(request, user_pk):
	User = get_user_model()
	person = User.objects.get(pk=user_pk)
	if person != request.user:
		if request.user in person.followers.all():
			person.followers.remove(request.user)
		else:
			person.follwers.add(request.user)
	return redirect('accounts:profile', person.username)
```
3. template
```html
<!-- accounts/profile.html -->

<div>
<div>
	팔로잉 : {{ person.followings.all|length }} / 팔로워 : {{ person.followers.all|length }}
</div>
{% if request.user != person %}
	<div>
	<form action="{% url 'accounts:follow' person.pk %}" method='POST'>
		{% csrf_token %}
		{% if request.user in person.followers.all %}
		<input type="submit" value='Unfollow'>
		{% else %}
		<input type="submit" value='Follow'>
		{% endif %}
	</form>
	</div>
{% endif %}
</div>
```
## Fixtures
- Django가 데이터베이스로 가져오는 방법을 알고있는 데이터 모음
- 초기 데이터 제공 목적으로 사용

### fixtures 관련 명령어
- dumpdata: 생성(데이터 추출)
- loaddata: 로드(데이터 입력)

### dumpdata
- 데이터베이스의 모든 데이터를 추출

```bash
$ python manage.py dumpdata [app_name[.ModelName]] [app_name[.ModelName] ...] > filename.json
```

#### 활용 예시
```bash
$ python manage.py dumpdata --indent 4 articles.article > article.json
$ python manage.py dumpdata --indent 4 accounts.user > users.json
$ python manage.py dumpdata --indent 4 articles.comment > comments.json
```

> Fixtures 파일을 직접 만들지 말 것(반드시 dumpdata 명령어 통해 생성)

### loaddata
- Fixtures 데이터를 데이터베이스로 불러오기

#### Fixtures 파일 기본 경로
`app_name/fixtures/`
> Django는 설치된 모든 app의 디렉토리에서 fixtures 폴더 이후의 경로로 fixtures 파일을 찾아 load

#### 활용 예시

db 파일 삭제 후 migrate, 해당 위치로 fixtures 파일 이동
```
articles/
	fixtures/
		articles.json
		users.json
		comments.json
```
```bash
$ python manage.py loaddata articles.json users.json comments.json
```

#### loaddata 순서 주의사항

- 별도로 실행한다면 모델 관계에 따라 load 순서가 중요할 수 있음
	- comment는 article과 user에 대한 key 필요
	- article은 user에 대한 key 필요
	- 즉, user → article → comment 순으로 load해야 오류 발생 X

## Improve query
**query 개선하기**
> DB측에 보내는 query 개수를 줄이면서 같은 결과 얻기

### 사전 준비
- fixtures 데이터
	- 게시글 10개 / 댓글 100개 / 유저 5개
- 모델 관계
	- **[N:1]**  Article:User / Comment:Article / Comment:Article
	- **[N:M]**  Article:User 
```bash
$ python manage.py migrate
$ python manage.py loaddata users.json articles.json comments.json
```

### annotate
- SQL의 `GROUP BY` 사용
- 퀴리셋의 각 객체에 계산된 필드 추가
- 집계함수(Count, Sum 등)과 함께 자주 사용됨

다음과 같이 요청 바꾸기
```py
Book.objects.annotate(num_authors=Count('authors'))
```
- 결과 객체에 'num_authors'라는 새로운 필드 추가
- 각 책과 연관된 저자의 수를 계산
- 기존 필드와 함께 'num_authors'필드를 가지게 됨
- book.num_authors로 해당 책의 저자 수에 접근할 수 있게 됨

#### 사용 예시
**문제 상황: 11 queries including 10 similar**
- 각 게시글마다 댓글 개수를 반복 평가

**문제 해결**
```py
# views.py

def index_1(request):
	# articles = Article.objects.order_by('-pk')
	articles = Article.objects.annotate(Count('comment')).order_by('-pk')
	context = {
		'articles': articles,
	}
	return render(request, 'articles/index_1.html', context)
```
```html
<!-- index_1.html -->

<!-- <p>댓글개수 : {{ article.comment_set.count }}</p> -->
<p>댓글개수 : {{ article.comment__count }}</p>
```
- 게시글을 조회하면서 댓글 개수까지 한번에 조회해서 가져오기
- **11 queries including 10 similar → 1 query**

### select_related
- SQL의 INNER JOIN 사용
- 1:1 또는 N:1 관계에서 사용
	- ForeignKey나 OneToOneField 관계에 대해 JOIN을 수행
- 단일 쿼리로 관련 객체를 함께 가져와 성능 향상
- 처음 조회할 때 잘 조회하자

다음과 같이 요청 바꾸기
```py
Book.objects.select_related('publisher')
```
- Book 모델과 연관된 Publisher 모델의 데이터를 함게 가져옴
- FK 관계인 'publisher'를 JOIN 하여 단일 쿼리만으로 데이터 조회
- Book 객체 조회할 때 연관된 Publisher 정보도 함께 로드
- 추가적인 데이터베이스 쿼리 없이 `book.publisher.name`과 같은 접근이 가능

#### 사용 예시
**문제 상황: 11 queries including 10 similar and 8 duplicates**
- 각 게시글마다 작성한 유저명까지 반복 평가

**문제 해결**
```py
# views.py

def index_2(request):
	# articles = Article.objects.order_by('-pk')
	articles = Article.objects.select_related('user').order_by('-pk')
	context = {
		'articles': articles,
	}
	return render(request, 'articles/index_2.html', context)
```
- 게시글을 조회하면서 유저 정보까지 한번에 조회해서 가져오기
- **11 queries including 10 similar and 8 duplicates → 1 query**

### prefetch_related
- SQL이 아닌 Python을 사용한 JOIN을 진행
	- 관련 객체들을 미리 가져와 메모리에 저장하여 성능을 향상
- M:N 또는 N:1 역참조 관계에서 사용
	- ManyToManyField나 역참조 관계에 대해 별도의 쿼리를 실행

다음과 같이 요청 바꾸기
```py
Book.objects.prefetch_related('authors')
```
- Book과 Author는 다대다 관계
- Book 모델과 연관된 모든 Author 모델의 데이터 미리 가져옴
- Django가 별도의 쿼리로 Author 데이터를 가져와 관계 설정
- Book 객체 조회 후 연관된 모든 Author 정보가 미리 로드됨
- 추가적인 DB 쿼리 없이 `for author in book.authors.all()`과 같은 반복 실행됨

#### 사용 예시
**문제 상황: 11 queries including 10 similar**
- 각 게시글 출력 후 각 게시글의 댓글 목록까지 개별적으로 모두 평가

**문제 해결**
```py
# views.py

def index_3(request):
	# articles = Article.objects.order_by('-pk')
	articles = Article.objects.prefetch_related('comment_set').order_by('-pk')
	context = {
		'articles': articles,
	}
	return render(request, 'articles/index_3.html', context)
```
- 게시글 조회하면서 참조된 댓글까지 한번에 조회해서 가져오기
- **11 queries including 10 similar → 2 queries**

### select_related & prefetch_related
#### 사용 예시
**문제 상황: 111 queries including 110 similar and 100 duplicates**
- 게시글 + 각 게시글의 댓글 목록 + 댓글의 작성자를 단계적으로 평가
**문제 해결**
```py
# views.py

def index_3(request):
	# articles = Article.objects.order_by('-pk')
	articles = Article.objects.prefetch_related('comment_set').order_by('-pk')
	context = {
		'articles': articles,
	}
	return render(request, 'articles/index_3.html', context)
```
- 게시글 조회하면서 참조된 댓글까지 한번에 조회
- 게시글 + 각 게시글의 댓글 목록 + 댓글의 작성자 한번에 조회하기
- **111 queries including 110 similar and 100 duplicates → 2 queries**
