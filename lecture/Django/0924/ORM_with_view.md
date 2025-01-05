# ORM with view
> Django shell에서 연습했던 QuerySet API를 view함수에서 사용하기

## 1. 전체 게시글 조회

```py
# articles/views.py

from django.shortcuts import render
from .models import Article

# Create your views here.
def index(request):
    articles = Article.objects.all()
    context = {
        'articles': articles,
    }
    return render(request, 'articles/index.html', context)
```

```py
# crud/urls.py

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('articles/', include('articles.urls')),
]
```

```py
# articles/urls.py

from django.urls import path
from . import views

app_name = 'articles'
urlpatterns = [
    path('', views.index, name='index'),
]
```

```html
<!--articlese/templates/articles/index.html-->

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
    <h1>Articles</h1>
    <hr>
    {% for article in articles %}
    <!--Django에선 id 대신 pk 사용하는 것을 권장함 -->
    <p>글 번호: {{ article.pk }}</p> 
    <p>글 제목: {{ article.title }}</p>
    <p>글 내용: {{ article.content }}</p>
    <hr>
    {% endfor %}
        
</body>
</html>
```

## 2. 단일 게시글 조회

### Read
- articles/urls.py에 단일 게시글 url 추가(변수 라우팅 이용)
```py
urlpatterns = [
    ...
    path('<int:pk>/', views.detail, name='detail')
]
```
- templates/articles/views.py에 단일 게시글 표시할 view 함수 추가
```py
def detail(request, pk):
    article = Article.objects.get(pk=pk)
    context = {
        'article': article,
    }
    return render(request, 'articles/detail.html', context)
```
- articles/detail.html 작성
```html

```

### Create
> 2개의 view 함수 필요
    > - new: 사용자 입력 데이터 받을 페이지 렌더링
    > - create: 사용자 입력한 요청 데이터 DB에 저장

**new**
- articles/urls.py에 입력 데이터 받을 페이지(new) url 추가
- articles/views.py에 new 렌더링하는 view 함수 추가
- templates/articles/new.html 작성
    - index.html에 new 페이지로 이동할 링크 추가

**create**
- articles.urls.py에 create url 추가
- create.html 작성
- views.py에 create의 view 함수 추가

```py
# 1.
    # article = Article()
    # article.title = title
    # article.content = content
    # article.save()

    # 2. 유효성 검사로 인해 가장 많이 쓰임
    article = Article(title=title, content=content)
    article.save()


    # 3.
    # Article.objects.create(title=title, content=content)
```

**HTTP request methods**

#### GET
- 서버로부터 데이터를 요청하고 받아오는데(조회) 사용

- 특징
    1. 데이터 전송
        - URL의 Query String 통해 데이터 전송
    2. 데이터 제한
        - URL 길이에 제한이 있어 대량의 데이터 전송에는 적합하지 않음
    3. 브라우저 히스토리
        - 요청 URL이 브라우저 히스토리에 남음
    4. 캐싱
        - 브라우저는 GET 요청의 응답을 로컬에 저장할 수 있음
        - 동일한 URL로 다시 요청할 때, 서버에 접속하지 않고 저장된 결과를 사용
        - 페이지 로딩 시간을 크게 단축

    > 예시: 검색쿼리 전송, 웹페이지 요청, API에서 데이터 조회

#### POST
- 서버에 데이터를 제출하여 리소스를 변경(생성, 수정, 삭제)

- 특징
    1. 데이터 전송
        - HTTP Body를 통해 데이터 전송
    2. 데이터 제한
        - GET에 비해 더 많은 양의 데이터를 전송할 수 있음
    3. 브라우저 히스토리
        - POST 요청은 브라우저 히스토리에 남지 않음
    4. 캐싱
        - POST 요청은 기본적으로 캐시 할 수 없음
        - POST 요청이 일반적으로 서버의 상태를 변경하는 작업을 수행하기 때문

    > 예시: 로그인 정보 제출, 파일 업로드, 새 데이터 생성(게시글 작성), API에서 데이터 변경 요청

#### HTTP response status code
- 서버가 클라이언트의 요청에 대한 처리 결과를 나타내는 3자리 숫자
    - 클라이언트에게 요청 처리 결과를 명확히 전달
    - 문제 발생 시 디버깅에 도움
    - 웹 애플리케이션의 동작을 제어하는데 사용

> 200 : 성공\
> 403 Forbidden : 권한 때문에 요청 거절

#### CSRF
- 사이트 간 요청 위조
    - 사용자가 자신의 의지와 무관하게 공격자가 의도한 행동을 하여 특정 웹페이지를 보안에 취약하게 하거나 수정, 삭제 등의 작업을 하게 만드는 공격 방법

#### CSRF Token 적용
- DTL의 csrf_token 태그를 사용해 손쉽게 사용자에게 토큰 값을 부여
- 요청 시 토큰 값도 함께 서버로 전송될 수 있도록
    - 서버가 해당 요청이 DB에 영향을 주는 요청에 대해 Django가 직접 제공한 페이지에서 데이터를 작성하고 있는 것인지에 대한 확인 수단
    - 겉모습이 똑같은 위조 사이트나 정상적이지 않은 요청에 대한 방어수단

**왜 POST일 때만 Token을 확인할까?**
- POST는 단순 조회를 위한 GET과 달리 특정 리소스에 변경을 요구하는 의미와 기술적인 부분을 갖고 있기 때문
- DB에 조작을 가하는 요청은 반드시 인증 수단이 필요 

#### Redirect
> 게시글 작성 후 완료를 알리는 페이지를 응답한다?
- '조회'가 아닌 '작성'의 요청이기 때문에 게시글 저장 후 페이지를 응답하는 것은 POST 요청에 대한 적절한 응답이 아님
    - 서버는 데이터 저장 후 페이지를 응답하는 것이 아닌, 사용자를 적절한 기존 페이지로 보내야 한다.
    - 즉, 사용자가 GET 요청을 한번 더 보내도록 해야 한다.

- `redirect()`: 클라이언트가 인자에 작성된 주소로 다시 요청을 보내도록 하는 함수
- 동작 원리:
    1. redirect 응답을 받은 클라이언트는 detail url로 다시 요청을 보내게 됨
    2. 결과적으로 detail view 함수가 호출되어 detail view 함수의 반환 결과인 detail 페이지를 응답받음
    3. 사용자는 게시글 작성 후 작성된 게시글의 detail 페이지로 이동하는 것으로 느기게 됨

### Delete
- urls.py에 delete url 추가
- view함수에 delete view함수 추가, index로 redirect한 결과 반환
- detail.html에 delete 구현

### Update
> 2개의 view 함수 필요
    > - edit: 사용자 입력 데이터 받을 페이지 렌더링
    > - update: 사용자 입력한 요청 데이터 DB에 저장

- urls.py에 edit, update url 추가
    - 수정 후 해당 게시글(detail) 표시하도록
- view 함수에 edit, update의 view함수 추가
- edit.html 생성
    - 수정 시 이전 데이터 출력되도록
- detail.html에 edit 페이지로 이동할 링크 작성
    