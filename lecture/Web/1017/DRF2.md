# N:1 관계와 DRF

## 사전 준비
### Comment 모델 정의
- Comment 클래스 정의 및 데이터베이스 초기화
	```py
	# articles/models.py

	class Comment(models.Model):
		article = models.ForeignKey(Article, on_delete=models.CASCADE)
	```
- Migration 및 fixtures 데이터 로드
	```bash
	$ python manage.py makemigrations
	$ python manage.py migrate
	$ python manage.py loaddata articles.json comments.json
	```

**URL 및 HTTP request method 구성**
| URL | GET | POST | PUT | DELETE |
|:---:|:---:|:---:|:---:|:---:|
|`comments/`|댓글목록조회||||
|`comments/1/`|단일댓글조회||단일댓글수정|단일댓글삭제|
|`articles/1/comments/`||댓글생성|||

## GET
- CommentSerializer 정의
### 댓글 목록 조회
1. **url**
	```py
	urlpatterns = [
		...,
		path("comments/", views.comment_list),
	]
	```
2. **view**
	```py
	@api_view(['GET'])
	def comment_list(request):
		comments = Comment.objects.all()    # 댓글 전체 조회
		serializer = CommentSerializer(comments, many=True)     # 데이터 직렬화 : QuerySet일 때만 many=True 사용 / 단일 데이터는 사용 X
		return Response(serializer.data)
	```

### 단일 댓글 조회
1. **url**
	```py
	urlpatterns = [
		...,
		path("comments/<int:comment_pk>/", views.comment_detail),
	]
	```
2. **view**
	```py
	@api_view(['GET', 'DELETE', 'PUT'])
	def comment_detail(request, comment_pk):
		comment = Comment.objects.get(pk=comment_pk)

		if request.method == 'GET':
			serializer = CommentSerializer(comment)
			return Response(serializer.data)
	```

	- article 번호 대신 제목으로 구성할 수도 있음
	- 개발자가 어떻게 설계하느냐에 따라 달린 것이지, 모든 데이터를 무조건 제공해야 하는 것은 아니다.

## POST
1. **url**
	```py
	urlpatterns = [
		...,
		path("articles/<int:article_pk>/comments/", views.comment_create),
	]
	```

2. **views**
	```py
	@api_view(['GET', 'DELETE', 'POST'])
	def article_detail(request, article_pk):
		article = Article.objects.get(pk=article_pk)

		if request.method == 'GET':
			serializer = ArticleSerializer(article)
			return Response(serializer.data)

		elif request.method == 'DELETE':
			comment.delete()
			return Response(status=status.HTTP_204_NO_CONTENT)

		elif request.method == 'POST':
			serializer = CommentSerializer(
				article, data=request.data, partial=True
			)
			if serializer.is_valid(raise_exception=True):
				serializer.save()
				return Response(serializer.data)
	```

	- 왜 400?
	- 외래 키에 해당하는 article field: 필수 입력으로 설정 -> 누락으로 판단
	- 유효성 검사에서 제외 필요
	- article field를 읽기 전용 필드로 설정(읽기전용필드 문서로 이동)

3. **serializers.py의 `article` 필드를 읽기 전용 필드로 설정**
	```py
	class CommentSerializer(serializers.ModelSerializer):
		class Meta:
			model = Comment
			fields = '__all__'
			read_only_fields = ('article',)
	```
## DELETE & PUT

**view**
```py
@api_view(['GET', 'DELETE', 'PUT'])
def comment_detail(request, comment_pk):
    comment = Comment.objects.get(pk=comment_pk)
    if request.method == 'GET':
        serializer = CommentSerializer(comment)
        return Response(serializer.data)
    
    elif request.method == 'DELETE':
        comment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    elif request.method == 'PUT':
        serializer = CommentSerializer(comment, data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)
```
## 응답 데이터 재구성
- 댓글 조회 시 게시글의 제목까지 제공하고 싶다면?
- CommentSerializer 내부 클래스로 ArticleTitleSerializer 선언 가능(오버라이드)
	```py
	class CommentSerializer(serializers.ModelSerializer):
		class ArticleTitleSerializer(serializers.ModelSerializer):
			class Meta:
				model = Article
				fields = ('title',)

		article = ArticleTitleSerializer(read_only = True)

		class Meta:
			model = Comment
			fields = '__all__'
			# read_only_fields = ('article',)
	```
	- 오버라이드 시 기존의 read_only_fields 속성 사용 불가
	- 새로운 필드에 read_only 키워드 인자로 작성하기!

# 역참조 데이터 구성(JSON 재구성)

**단일 게시글 조회 시 다음과 같은 사항에 대한 데이터 재구성하기**
1. 해당 게시글에 작성된 댓글 목록도 함께 붙여서 응답
2. 해당 게시글에 작성된 댓글 개수도 함께 붙여서 응답

## 단일 게시글 + 댓글 목록
**Nested relationships (역참조 매니저 활용)**
```py
class ArticleSerializer(serializers.ModelSerializer):
	class CommentDetailSerializer(serializers.ModelSerializer):
		class Meta:
			model = Comment
			fields = ('id', 'content',)

	# comment_set 역참조 데이터를 override 
	# QuerySet으로 반환 : many=True
	# 유효성 검사 대상은 아님 : read_only=True

	comment_set = CommentDetailSerializer(many=True, read_only=True)

	class Meta:
		model = Article
		fields = '__all__'
```
- 모델 관계 상으로 참조하는 대상은 참조되는 대상의 표현에 포함되거나 중첩될 수 있음
- 이러한 중첩된 관계는 serializers를 필드로 사용하여 표현 가능

## 단일 게시글 + 댓글 개수
**댓글 개수에 해당하는 새로운 필드 생성**
```py
class ArticleSerializer(serializers.ModelSerializer):
	class CommentDetailSerializer(serializers.ModelSerializer):
		class Meta:
			model = Comment
			fields = ('id', 'content',)

	comment_set = CommentDetailSerializer(many=True, read_only=True)
	comment_count = serializers.IntegerField(source='comment_set.count', read_only=True)	# 새로운 필드 생성
	class Meta:
		model = Article
		fields = '__all__'
```
- 'source' 인자 : 필드를 채우는 데 사용할 속성의 이름
- 점 표기법(dotted notaion) 사용하여 속성을 탐색할 수 있음


## 읽기 전용 필드
#### 언제 써야되나?
- 사용자에게 입력으로는 받지 않지만 제공은 해야 하는 경우
- 새로운 필드 값을 만들어 제공해야 하는 경우

#### 특징 및 주의사항
- (유효성 검사에서 제외, 데이터 조회 시에는 출력)
- 유효성 검사에서 제외된다고 해서 반드시 생성로직에서만 사용이 국한되는 것은 아님

#### read_only_fields 속성과 read_only 인자의 사용처
- read_only_fields
	- 기존 외래 키 필드 값을 그대로 응답 데이터에 제공하기 위해 지정

- read_only
	- 기존 외래 키 필드 값의 결과를 다른 값으로 덮어 씀
	- 새로운 응답 데이터 값을 제공하는 경우

# API 문서화
## OpenAPI Specification(OAS)
**RESTful API를 설명하고 시각화하는 표준화된 방법**
> API에 대한 세부사항을 기술할 수 있는 공식 표준
Swagger, Redoc
OAS 기반 API에 대한 문서를 생성하는데 도움을 주는 오픈소스 프레임워크

## 문서화 활용
### drf-spectacular 라이브러리
- **설치 및 등록**
```bash
$ pip install drf-spectacular
```
```py
# settings.py

INSTALLED_APPS = [
	...,
	'drf_spectacular',
	...,
]
```
- **관련 설정 코드 입력(OpenAPI 구조 자동 생성 코드)**
```py
# settings.py

REST_FRAMEWORK = {
	# YOUR SETTINGS
	'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
}
```
- swagger, redoc 페이지 제공을 위한 url 작성
```py
# drf/urls.py
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView

urlpatterns = [
	...,
	path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
	path('api/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
	path('api/schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]
```
- http://127.0.0.1:8000/api/schema/swagger-ui/, http://127.0.0.1:8000/api/schema/redoc/ 확인

### 설계 우선 접근법
- OAS의 핵심 이점
- API를 먼저 설계하고 명세를 작성한 후, 이를 기반으로 코드를 구현하는 방식
- API의 일관성을 유지하고, API 사용자는 더 쉽게 API를 이해하고 사용할 수 있음
- 또한 OAS를 사용하면 API가 어떻게 작동하는지를 시각적으로 보여주는 문서를 생성할 수 있으며, 이는 API를 이해하고 테스트하는 데 매우 유용

**참고**

- 참조하기(온실 django_11_4)
```py
from rest_framework import serializers
from .models import Book, Review


class BookListSerializer(serializers.ModelSerializer):

    class Meta:
        model = Book
        fields = ('title', )

class BookSerializer(serializers.ModelSerializer):
    
    class ReviewDetailSerializer(serializers.ModelSerializer):
        
        class Meta:
            model = Review
            fields = ('content', 'score',)

    review_set = ReviewDetailSerializer(many=True, read_only=True)
    review_count = serializers.IntegerField(source='review_set.count', read_only=True)

    class Meta:
        model = Book
        fields = '__all__'

class ReviewListSerializer(serializers.ModelSerializer):
    class BookOnReviewSerializer(serializers.ModelSerializer):
        class Meta:
            model = Book
            fields = ('isbn',)
    
    book = BookOnReviewSerializer(read_only=True)
    book.isbn = serializers.CharField(source='book.isbn', read_only=True)

    class Meta:
        model = Review
        fields = ('book', 'content', 'score',)
        read_only_fields = ('book',)

class ReviewSerializer(serializers.ModelSerializer):

    class Meta:
        model = Review
        fields = '__all__'
        read_only_fields = ('book',)
```