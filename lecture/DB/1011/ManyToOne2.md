# 1:N 관계(2)
## Article & User
### 모델 관계 설정
- User 외래 키 정의
	```py
	# models.py
	from django.conf import settings

	class Article(models.Model):
		user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
		... 
	```
	- get_user_model() 대신 settings.AUTH_USER_MODEL 사용

	|           | get_user_model() | settings.AUTH_USER_MODEL |
	|:---------:|:----------------:|:------------------------:|
	|  반환 값  | User Object(객체) | 'accounts.User' (문자열) |
	| 사용 위치 | models.py가 아닌 다른 모든 위치 | models.py |
	- get_user_model(): 프로젝트가 가리키고 있는 유저 모델을 호출
	- init 시점에서 어느 파일이 먼저 실행될 지 모름
	- 다른 클래스에서 get_user_model()이 아직 호출이 되지 않은 경우 오류 발생
	- 중요한 것은 User 모델은 직접 참조하지 않는다는 것

- Migration
	- 이전과 다른 메시지가 뜰 것이다.
	- 기존에 테이블이 있는 상황에서 필드를 추가하기 때문에 발생하는 과정
	- 기본적으로 모든 필드에는 NOT NULL 제약조건이 있기 때문에 데이터 없이는 새로운 필드 추가 불가
	- '1'을 입력하고 Enter 진행 (다음 화면에서 직접 기본 값 입력)
	- 추가하는 외래 키 필드에 어떤 데이터를 넣을 것인지 직접 입력해야 함
	- '1'을 입력하고 Enter 진행
		- 기존에 작성된 게시글이 있다면 모두 1번 회원이 작성한 것으로 처리됨
	- articles_article 테이블에 user_id 필드 생성 확인

### 게시글 CREATE
- User 모델에 대한 외래 키 데이터 입력을 위해 불필요한 input 출력됨
- ArticleForm 출력 필드 수정
	```py
	# articles/forms.py

	class ArticleForm(forms.ModelForm):
		class Meta:
			model = Article
			fields = ('title', 'content',)
	```
- user_id 필드 데이터 누락 방지 위해 게시글 작성 시 작성자 정보가 함께 저장될 수 있도록 save의 commit 옵션 활용
	```py
	# articles/views.py

	@login_required
	def create(request):
		if request.method == 'POST':
			form = Articleform(request.POST)
			if form.is_valid():
				article = form.save(commit=False)
				article.user = request.user
				article.save()
				return redirect('articles:detail', article.pk)
		else:
			form = ArticleForm()
			context = {
				'form': form,
			}
		return render('articles/create.html', context)
	```
### 게시글 READ
- 각 게시글의 작성자 이름 출력
	```html
	<!-- articles/index.html -->

	{% for article in articles %}
		<p>작성자 : {{ article.user }}</p>
		<p>글 번호 : {{ article.pk }}</p>
		<a href="{% url 'articles:detail' article.pk %}">
			<p>글 제목 : {{ article.title }}</p>
		</a>
		<p>글 내용 : {{ article.content }}</p>
		<hr>
	{% endfor %}
	```
	```html
	<!-- articles/detail.html -->

	<h2>DETAIL</h2>
	<h3>{{ article.pk }}번째 글</h3>
	<hr>
	<p>작성자 : {{ article.user }}</p>
	<p>제목 : {{ article.title }}</p>
	<p>내용 : {{ article.content }}</p>
	<p>작성 시각 : {{ article.created_at }}</p>
	<p>수정 시각 : {{ article.updated_at }}</p>
	```
### 게시글 UPDATE
- 게시글 수정 요청 사용자와 게시글 작성 사용자를 비교하여 본인의 게시글만 수정할 수 있도록
	```py
	# articles/views.py

	@login_required
	def update(request, pk):
		article = Article.objects.get(pk=pk)
		if request.user == article.user:	# 수정 요청자가 게시글 작성자라면
			if request.method == 'POST':
				form = ArticleForm(request.POST, instance=article)
				if form.is_valid():
					form.save()
					return redirect('articles:detail', article.pk)
			else:
				form = ArticleForm(instance-article)
		else:
			return redirect('articles:index')
	```
- 해당 게시글의 작성자가 아니라면, 수정/삭제 버튼을 출력하지 않도록 하기
	```html
	<!-- articles/detail.html -->

	{% if request.user == article.user %}
		<a href="{% url 'articles:update' article.pk %}">UPDATE</a><br>
		<form action="{% url 'articles:delete' article.pk %}" method="POST">
			{% csrf_token %}
			<input type="submit" value="DELETE">
		</form>
	{% endif %}
	```

### 게시글 DELETE
- 삭제를 요청하려는 사람과 게시글을 작성한 사람을 비교하여 본인의 게시글만 삭제할 수 있도록 하기
	```py
	# articles/views.py

	@login_required
	def delete(request, pk):
		article = Article.objects.get(pk=pk)
		if request.user == article.user:
			article.delete()
		return redirect('articles:index')
	```

## Comment & User
### 모델 관계 설정
- user 외래 키 정의
	```py
	# articles/models.py

	class Comment(models.Model):
		...
		user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
		...
	```
### 댓글 CREATE
- user_id 필드 데이터 누락 방지 위해 댓글 작성 시 작성자 정보가 함께 저장될 수 있도록 save의 commit 옵션 활용
	```py
	# articles/views.py

	@login_required
	def comments_create(request, pk):
		article = Article.objects.get(pk=pk)
		comment_form = CommentForm(request.POST)
		if comment_form.is_valid():
			comment = comment_form.save(commit=False)
			comment.article = article
			comment.user = request.user
			comment.save()
			return redirect('articles:detail', article.pk)
	```
### 댓글 READ
- 댓글 출력 시 댓글 작성자와 함께 출력
	```html
	
	```

### 댓글 DELETE

## View decorators
- View 함수의 동작을 수정하거나 추가 기능을 제공
- 코드의 재사용성을 높이고 뷰 로직을 간결하게 유지

### Allowed HTTP methods
- 특정 method로만 View함수에 접근할 수 있도록 제한
- 지정되지 않은 method로 요청이 들어오면 `HttpResponseNotAllowed (405)` 반환
- 대문자로 HTTP method 지정
1. require_http_methods(["METHOD1", "METHOD2", ...])
	- 지정된 HTTP method만 허용
	```py
	from django.views.decorators.http import require_http_methods

	@require_http_methods(['GET', 'POST'])
	def func(request):
		pass
	```
2. require_safe()
	- GET과 HEAD method만 허용
	```py
	from django.views.decorators.http import require_safe

	@require_safe
	def func(request):
		pass
	```

3. require_POST()
	- POST method만 허용
	```py
	from django.views.decorators.http import require_POST

	@require_POST
	def func(request):
		pass
	```

## ERD(entity relationship diagram)
- 데이터베이스의 구조를 시각적으로 표현
- entity(table), 속성, 그리고 엔티티 간의 관계를 그래픽 형태로 나타내어 시스템의 논리적 구조 모델링
- 데이터베이스 설계의 핵심 도구
- 시각적 모델링으로 효과적인 의사소통 지원
- 실제 시스템 개발 전 데이터 구조 최적화에 중요

### ERD 구성요소
1. 엔티티(테이블)
	- 데이터베이스에 저장되는 객체나 개념
	- 고객, 주문, 제품
2. 속성(컬럼)
	- 엔티티의 특성이나 성질
	- 고객(이름, 주소, 전화번호)
3. 관계(연관성)
	- 엔티티간의 연관성
	- 고객이 주문한 제품

**Cardinality**
- 한 엔티티와 다른 엔티티 간의 수적 관계를 나타내는 표현


### ERD 제작 사이트
- Draw.io : [https://app.diagrams.net/]
- ERDCloud : [https://www.erdcloud.com/]

## 참고
### 추가 기능 구현
`@login_required`: 인증된 사용자일 경우에만 view함수 실행하도록 하는 데코레이터