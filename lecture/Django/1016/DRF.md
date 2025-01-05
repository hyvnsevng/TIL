# REST API
## API
**두 소프트웨어가 서로 통신할 수 있게 하는 메커니즘**
> 클라이언트-서버처럼 서로 다른 프로그램에서 요청과 응답을 받을 수 있도록 만든 체계
- 기상청 API: 날씨 앱, 웹사이트의 날씨 정보 등 다양한 서비스들이 기상청 시스템의 기상 데이터 요청해서 받아감
  - 기상청 시스템에는 정보를 요청하는 지정된 형식이 있음
  - 지역 ,날짜, 조회할 내용들(온도, 바람)들을 제공하는 매뉴얼
  - 소프트웨어 간 지정된 정의(형식)으로 소통하는 수단 → API
복잡한 코드를 추상화하여 대신 사용할 수 있는 몇가지 더 쉬운 구문 제공

### Web API
- 웹 서버 또는 웹 브라우저를 위한 API
- 직접 개발하기 보단 여러 Open API들을 활용것이 추세
- 대표적인 서드 파티 Open API
  - Youtube API
  - Google Map API
  - Naver Papago API
  - Kakao Map API
## REST(Representational State Transfer) API
API 서버를 개발하기 위한 일종의 소프트웨어 설계 방법론
- REST라는 설계 디자인 약속을 지켜 구현한 API
- 규칙 X
- API 서버를 설계하는 구조가 서로 다르니 이렇게 맞춰서 설계하는 게 어때 ?
### RESTful API
- REST 원리를 따르는 시스템을 RESTful하다고 부름
- 자원을 정의하고 자원에 대한 주소를 지정하는 전반적인 방법을 서술

#### REST에서 자원을 정의하고 주소를 지정하는 방법
1. 자원의 식별: URI
2. 자원의 행위: HTTP Methods
3. 자원의 표현: JSON 데이터(데이터 표현)

## 자원의 식별
### URI(Uniform Resource Identifier)
인터넷에서 리소스를 식별하는 문자열
가장 일반적인 URI는 웹 주소로 알려진 URL
### URL(Uniform Resource Locator)
웹에서 주어진 리소스의 주소
네트워크 상에 리소스가 어디 있는지 알려주기 위한 약속
#### Schema(Protocol)
- 브라우저가 리소스를 요청하는데 사용해야 하는 규약
- URL의 첫부분은 브라우저가 어떤 규약을 사용하는지 나타냄
- 기본적으로 웹은 http(s)를 요구
  - 메일을 열기 위한 mailto:, 파일을 전송하기 위한 ftp: 등 다른 프로토콜도 존재
#### Domain Name
- 요청중인 웹 서버를 나타냄
- 어떤 웹 서버가 요구되는 지를 가리킴
- 직접 IP 주소를 사용하는 것도 가능하지만, 사람이 외우기 어렵기 때문에 주로 Domain Name으로 사용
  - 예: 도메인 google.com의 IP 주소는 142.251.42.142
#### Port
- 웹 서버의 리소스에 접근하는데 사용되는 기술적인 문
- HTTP의 표준 포트
  - HTTP - 80
  - HTTPS - 443
- 표준 포트만 작성 시 생략 가능
#### Path
- 웹 서버의 리소스 경로
- 초기엔느 실제 파일이 위치한 물리적 위치를 나타냈지만, 요즘은 실제 위치가 아닌 추상화된 형태의 구조 표현
  - `/articles/create/`라는 주소가 실제 articles 폴더 안에 create 폴더 안을 나타내는 것은 아님
#### Parameters
- 웹 서버에 제공하는 추가적인 데이터
  - HTTP 요청이 GET일때만 사용
- `&` 기호로 구분되는 key-value 쌍 목록
- 서버는 리소스를 응답하기 전에 이러한 파라미터를 사용하는 추가 작업을 수행할 수 있음
#### Anchor
- 브라우저에 해당 지점에 있는 콘텐츠 표시
  - 일종의 북마크 역할
  - `#` 이후 부분은 서버에 전달되지 않고 브라우저에게 해당 지점으로 이동할 수 있도록 함
  
## 자원의 행위
#### HTTP Request Methods
리소스에 대한 행위(수행하고자 하는 동작)를 정의
1. GET
  - 서버에 리소스의 표현을 요청
  - GET을 사용하는 요청은 데이터만 검색해야 함
2. POST
  - 데이터를 지정된 리소스에 제출
  - 서버의 상태를 변경
3. PUT
  - 요청한 주소의 리소스를 수정
4. DELETE
  - 지정된 리소스를 삭제
같은 주소로 여러 동작 요청 가능
#### HTTP response status codes
- 특정 HTTP 요청이 성공적으로 완료되었는지 여부를 나타냄
- 200, 400번대(200: 어떻게 성공) 
- 400: 클라이언트 잘못
- 500 서버 잘못
  
## 자원의 표현
- 그동안 서버가 응답(자원을 표현)했던 것
- 지금까지 Django 서버는 사용자에게 페이지(html)만 응답하고 있었음
- 다양한 데이터 타입 응답 가능
- REST API는 JSON 타입으로 응답하는 것 권장
  - JSON 데이터를 응답하는 REST API 서버로 변환 시 Django는 Template 역할 X
  - 기존의 MTV 패턴 X, BE 만을 담당

## json 데이터 응답
가상환경, 패키지 설치, migrate, loaddata 후 python-request-sample.py 확인

# DRF with Single Model
## DRF
**Django에서 Restful API 서버를 쉽게 구출할 수 있도록 도와주는 오픈소스 라이브러리**
#### Postman
- API 개발 및 테스트를 위한 서비스
- 요청 데이터 구성, 응답 확인, 환경 설정, 자동화  테스트 등 다양한 기능 제공
  - Workspace - My workspace
  - 요청 URL / 요청 시 필요한 데이터 작성 / 응답 결과 출력 화면

## Serializer
### 직렬화(Serialize)
**여러 시스템에서 활용하기 위해 데이터 구조나 객체 상태를 나중에 재구성할 수 있는 포맷으로 변환하는 과정**
> 어떠한 언어나 환경에서도 나중에 다시 쉽게 사용할 수 있는 포맷으로 변환
### ModelSerializer
**Django 모델과 연결된 Serializer 클래스**
> 일반 Serializer와 달리 사용자 입력 데이터를 받아 자동으로 모델 필드에 맞추어 Serialization을 진행
#### 사용 예시
- Article 모델을 토대로 직렬화를 수행하는 ArticleSerializer 정의
- 게시글 데이터 목록 제공
```py
# articles/serializers.py

from rest_framework import serializers
from .models import Article

class ArticleListSerealizer(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = '__all__'
```
  - serializers.py의 위치나 파일명은 자유롭게 작성 가능
# CRUD with modelserializer
**URL과 HTTP requests methods 설계**
|          | GET | POST | PUT | DELETE |
|:-------:|:----:|:----:|:----:|:-----:|
| **articles/** | 전체 글 조회 | 글 작성 | | |
| **articles/1/** | 1번 글 조회 | | 1번 글 수정 | 1번 글 삭제 |
## GET
### GET - List
- 게시글 데이터 목록 조회하기
1. 게시글 데이터 목록을 제공하는 ArticleListSerializer 정의
	```py
	# articles/serializers.py

	from reest_framework import serializers
	from .models import Article

	class ArticleListSerealizer(serializers.ModelSerializer):
		class Meta:
			model = Article
			fields = ('id', 'title', 'content',)
	```
2. url
	```py
	# articles/urls.py

	urlpatterns = [
		path('articles/', views.article_list),
	]
	```
3. view
	```py
	# articles/views.py

	from rest_framework.response import Response
	from rest_framework.decorators import api_view

	from .models import Article
	from .serializers import ArticleListSerializer


	@api_view(['GET'])
	def article_list(request):
		articles = Article.objects.all()
		serializer = ArticleListSerializer(articles, many=True)
		return Response(serializer.data)
	```
	- many 옵션
		- Serialize 대상이 QuerySet인 경우 입력
	- data 속성
		- Serialized data 객체에서 실제 데이터 추출
4. http://127.0.0.1:8000/api/v1/articles/ 응답 확인


**과거 view 함수와의 응답 데이터 비교**
- 과거 : HTML에 출력되도록 페이지와 함께 응답했던 view 함수
	```py
	def index(request):
		articles = Article.objects.all()
		context = {
			'articles': articles,
		}
		return render(request, 'articles/index.html', context)
	```
- 현재 : JSON 데이터로 serialization 하여 페이지 없이 응답하는 view 함수
	```py
	@api_view(['GET'])
	def article_list(request):
		articles = Article.objects.all()
		serializer = ArticleListSerializer(articles, many=True)
		return Response(serializer.data)
	```

### GET - Detail
- 단일 게시글 데이터 조회하기
1. 게시글 데이터 목록을 제공하는 ArticleListSerializer 정의
	```py
	# articles/serializers.py

	from reest_framework import serializers
	from .models import Article

	class ArticleListSerealizer(serializers.ModelSerializer):
		class Meta:
			model = Article
			fields = '__all__'
	```
2. url
	```py
	# articles/urls.py

	urlpatterns = [
		path('articles/<int:article_pk>/', views.article_detail),
	]
	```
3. view
	```py
	# articles/views.py

	from rest_framework.response import Response
	from rest_framework.decorators import api_view

	from .models import Article
	from .serializers import ArticleListSerializer, ArticleSerializer


	@api_view(['GET'])
	def article_detail(request, article_pk):
		article = Article.objects.get(pk=article_pk)
		serializer = ArticleSerializer(article)
		return Response(serializer.data)
	```
4. http://127.0.0.1:8000/api/v1/articles/1/ 응답 확인

## POST
- 게시글 데이터 생성
1. article_list view 함수 구조 변경(method에 따른 분기처리)
	```py
	# articles/views.py

	from rest_framework import status

	@api_view(['GET', 'POST'])
	def article_list(request):
		if request.method == 'GET':
			articles = Article.objects.all()
			serializer = ArticleListSerializer(articles, many=True)
			return Response(serializer.data)
		
		elif request.method == 'POST':
			serializer = ArticleSerializer(data=request.data)
			if serializer.is_valid():
				serializer.save()
				return Response(serializer.data, status=status.HTTP_201_CREATED)
			return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
	```
	- 데이터 생성 성공 시 201 Created 응답
	- 데이터 생성 실패 시 400 Bad request 응답
2. http://127.0.0.1:8000/api/v1/articles/ 응답 확인
3. http://127.0.0.1:8000/api/v1/articles/21/ 새로 생성된 게시글 데이터 확인

## DELETE
- 게시글 데이터 삭제
1. 요청에 대한 데이터 삭제 성공 시 204 No Content 응답
	```py
	# articles/views.py

	@api_view(['GET', 'DELETE'])
	def article_detail(request, article_pk):
		article = Article.objects.get(pk=article_pk)
		if request.method == 'GET':
			serializer = ArticleSerializer(article)
			return Response(serializer.data)
		
		elif request.method == 'DELETE':
			article.delete()
			return Response(status=status.HTTP_204_NO_CONTENT)
	```
2. http://127.0.0.1:8000/api/v1/articles/21/ 게시글 삭제 확인

## PUT
- 게시글 데이터 수정
1. 요청에 대한 데이터 수정 성공 시 200 OK 응답 
	```py
	# articles/views.py

	@api_view(['GET', 'DELETE', 'PUT'])
	def article_detail(request, article_pk):
		... 
		elif request.method == 'PUT':
			serializer = ArticleSerializer(article, data=request.data, partial=True)

			if serializer.is_valid():
				serializer.save()
				return Response(serializer.data)
			return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
	```
	- `partial`: 부분 업데이트를 허용하기 위한 인자
	- `partial=False`인 경우, title만 수정하려 해도 반드시 content 값도 요청 시 함께 전송해야 함
	- 기본적으로 serializer는 모든 필수 필드에 대한 값을 전달받기 떄문
		- 수정하지 않는 다른 필드 데이터도 모두 전송해야 하며, 그렇지 않으면 유효성 검사에서 오류 발생
2. http://127.0.0.1:8000/api/v1/articles/1/ 응답 및 수정된 데이터 확인

**참고**
**raise_exception**
- `is_valid()`의 선택 인자
- 유효성 검사 통과 못할  경우 ValidationError 예외 발생
- DRF에서 제공하는 기본 예외 처리기에 의해 자동으로 처리되며 기본적으로 HTTP 400 반환

