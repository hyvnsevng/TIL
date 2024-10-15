# 1:N 관계
> 한 테이블의 0개 이상의 레코드가 다른 테이블의 레코드 한 개와 관련된 관계

- Article(1):Comment(N)
	- 0개 이상의 댓글은 1개의 게시글에 작성될 수 있다.
- User(1):Article(N)
	- 0개 이상의 게시글은 1명의 유저에 의해 작성될 수 있다.
- User(1):Comment(N)
	- 0개 이상의 댓글은 1명의 유저에 의해 작성될 수 있다.
# 모델관계
**`ForeignKey(to, on_delete)`**
> 한 모델이 다른 모델을 참조하는 관계를 설정하는 필드
- 1:N 관계 표현
- 데이터베이스에서 외래 키로 구현

## 댓글모델정의
- ForeignKey 클래스의 인스턴스 이름은 참조하는 모델 클래스 이름의 단수형으로 작성하는 것을 권장
- 외래 키는 ForeignKey 클래스를 작성하는 위치와 관계없이 테이블의 마지막 필드로 생성됨
```py
# models.py

class Comment(models.Model):
	...
	article = models.ForeignKey(Article, on_delete=models.CASCADE)
	...
```
위와 같이 작성해도 외래키는 마지막 필드

### ForeignKey(to, on_delete)
- to
	- 참조하는 모델 class 이름
- on_delete
	- 외래키가 참조하는 객체(1)가 사라졌을 때 외래 키를 가진 객체(N)를 어떻게 처리할 지를 정의하는 설정(데이터 무결성)

### on_delete 의 CASCADE
- 참조된 객체(부모 객체)가 삭제될 때 이를 참조하는 모든 객체도 삭제되도록 지정

> 기타 on_delete 설정 값 참고
	- https://docs.djangoproject.com/en/4.2/ref/models/fields/#arguments
### Migration 이후 댓글 테이블 확인
- 만들어지는 필드 이름: `참조대상클래스이름_클래스이름`
- 참조하는 클래스 이름의 소문자(단수형)로 작성하는 것 권장

## 댓글생성
1. shell_plus에서 다음 실행
	```py
	Article.objects.create(title='title', content='content')
	```
2. 댓글 생성
	```py
	comment = Comment()
	comment.content = 'first comment'
	comment.save()
	```
	- 에러 발생 : articles_comment 테이블의 ForeignKeyField, article_id 값이 누락	
3. 게시글 작성
	```py
	article = Article.objects.get(pk=1)	# 게시글 조회
	comment.article = article	# 외래 키 데이터 입력(comment.article_id = article.pk로 pk 값을 직접 넣어줄 수도 있지만 권장 X)
	comment.save()	# 댓글 저장
	```

# 관계 모델 참조
## 역참조
- N:1 관계에서 1에서 N 참조
- 모델 간의 관계에서 관계를 정의한 모델이 아닌, 관계의 대사이 되는 모델에서 연결된 객체들에 접근하는 방식
- N은 외래 키를 가지고 있어 물리적으로 참조가 가능하지만, 1은 N에 대한 참조 방법이 존재하지 않아 별도의 역참조 키워드가 필요

`article.comment_set.all()`: 특정 게시글에 작성된 댓글 전체 조회 요청
- article: 모델 인스턴스
- comment_set : related manager(역참조 이름)
- all() : QuerySet API
	- objects 매니저를 통해 QuerySet API를 사용했던 것처럼 related manager 통해 QuerySet API를 사용할 수 있게 됨

### related manager 이름 규칙
- N:1 관계에서 생성되는 Related manager 이름은 `모델명_set` 형태로 자동 생성됨
	- 관계를 직접 정의하지 않은 모델에서 연결된 객체들을 조회할 수 있게 함
- 특정 댓글의 게시글 참조	(Comment -> Article)
	- `comment.article`
- 특정 게시글의 댓글 목록 참조 (Article -> Comment)
	- `article.comment_set.all()`

# 댓글 구현
## 댓글 CREATE
- forms : CommentForm 정의
	```py
	# articles/forms.py

	from .models import Article, Comment

	class CommentForm(forms.ModelForm):
		class Meta:
			model = Comment
			fields = ('content',)
	```
	- 출력 필드 지정하지 않으면 외래 키 필드까지 출력됨
	- 따라서 외래 키 데이터 출력에서 제외
	- 출력에서 제외된 외래 키 데이터는 어디서 받아와야 할까?
	- detail 페이지 URL의 pk값
- url: 
	```py
	# articles/urls.py

	urlpatterns = [
		...,
		path('<int:pk>/comments/', views.comments_create, name='comments_create'),
	]
	```
- view : CommentForm 이용해 detail 렌더링
	```py
	# articles/views.py

	from .forms import ArticleForm, CommentForm

	def detail(request, pk):
		article = Article.objects.get(pk=pk)
		comment_form = CommentForm()
		context = {
			'article': article,
			'comment_form': comment_form,
		}
		return render(request, 'articles/detail.html', context)
	```
- detail 페이지 작성
	```html
	<!-- articles/detail.html -->

	<form action="{% url 'articles:comments_create' article.pk %}" method="POST">
		{% csrf_token %}
		{{ comment_form }}
		<input type="submit">
	</form>
	```
- view : 댓글 생성 시 url로 받은 pk 인자를 게시글 조회에 사용
	```py
	# articles/views.py

	def comments_create(request, pk):
		article = Article.objects.get(pk=pk)
		comment_form = CommentForm(request.POST)
		# 외래 키 데이터를 넣는 타이밍이 필요
		# 외래 키를 넣을면 2가지 조건이 필요함.
		# 1. comment 인스턴스
		# 2. save 메서드 호출 전
		# 그런데 comment 인스턴스는 save 메서드가 호출되어야 생성됨
		# 따라서 save(commit=False)  통해 인스턴스 생성하지만 DB에 저장X
		if comment_form.is_valid():
			comment = comment_form.save(commit=False)
			comment.article = article
			comment.save()
			return redirect('articles:detail', article.pk)
		context = {
			'article': article,
			'comment_form': comment_form,
		}
		return render(request, 'articles/detail.html', context)
	```

## 댓글 READ
- detail view함수에서 전체 댓글데이터 조회
	```py
	# articles/views.py

	from .models import Article, Comment

	def detail(request, pk):
		article = Article.objects.get(pk=pk)
		comment_form = CommentForm()
		comments = article.comment_set.all()
		context = {
			'article': article,
			'comment_form':comment_form,
			'comments': comments,
		}
		return render(request, 'articles/detail.html', context)
- detail 페이지에 댓글 표시 수정
	```html
	<!-- articles/detail.html -->
	<h4>댓글 목록</h4>
	<ul>
		{% for comment in comments %}
			<li>{{ comment.content }}</li>
		{% endfor %}
	</ul>
	```

## 댓글 DELETE
- 댓글 삭제 url 작성
	```py
	# articles/urls.py

	urlpatterns = [
		...,
		path('<int:article_pk>/comments/<int:comment_pk>/delete/', views.comments_delete, name='comments_delete'),
	]
- 댓글 삭제 view함수 정의
	```py
	def comments_delete(request, article_pk, comment_pk):
		comment = Comment.objects.get(pk=comment_pk)
		# 첫번째 방법: 삭제되기 전에 article의 pk 변수에 저장하기
		# article_pk = comment.article.pk
		# 두번째 방법:
		article = Article.objects.get(pk=article_pk)
		comment.delete()
		return redirect('articles:detail', article.pk)
	```
- detail 페이지에 댓글 삭제 버튼 작성
	```html
	<!-- articles/detail.html -->

	<ul>
		{% for comment in comments %}
			<li>
				{{ comment.content }}
				<form action="{% url 'articles:comments_delete' article.pk comment.pk %}" method='POST'>
					{% csrf_token %}
					<input type="submit" value="DELETE">
				</form>
			</li>
		{% endfor %}
	</ul>
	```

## 참고
### 데이터 무결성
- DB에 저장된 데이터 값의 정확성을 보장하는 것
	- 데이터의 신뢰성 확보
	- 시스템 안정성
	- 보안 강화

### admin site 등록
- Comment 모델을 admin site에 등록

```py
#  articles/admin.py

from .models import Article, Comment

admin.site.register(Article)
admin.stie.register(Commnet)
```

### 댓글 추가 구현
#### 댓글이 없는 경우 대체 콘텐츠 출력
- for empty 태그 활용
```html
<!-- articlse/detail.html -->
{% for comment in comments %}
	<li>
		{{ comment.content }}
		<form action="{% url 'articles:comments_delete' article.pk comment.pk %}" method="POST">
			{% csrf_token %}
			<input type="submit" value="DELETE">
		</form>
	</li>
{% empty %}
	<p>댓글이 없어요...</p>
{% endfor %}
```

#### 댓글 개수 출력하기
- DTL filter - `length` 사용
- QuerySet API - `count()` 사용