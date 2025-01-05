# Cookie & Session

- 클라이언트와 서버간의 상태 정보를 유지하고 사용자를 식별하기 위해 사용

## HTTP

- HTML 문서와 같은 리소스들을 가져올 수 있도록 해주는 규약
- 웹에서 이루어지는 모든 데이터 교환의 기초

### 특징

1. 비연결 지향(connectionless)
   - 서버는 요청에 대한 응답을 보낸 후 연결을 끊음
2. 무상태(stateless)
   - 연결을 끊는 순간 클라이언트와 서버 간의 통신이 끝나며 상태 정보가 유지되지 않음

## 쿠키

- 서버가 사용자의 웹 브라우저에 전송하는 작은 데이터 조각
  - 서버가 제공하여 클라이언트 측에서 저장되는 작은 데이터 파일
  - 사용자 인증, 추적, 상태 유지 등에 사용되는 데이터 저장 방식

### 쿠키 동작 예시

1. 브라우저가 웹 서버에 웹 페이지를 요청
2. 웹 서버는 요청된 페이지와 함께 쿠키를 포함한 응답을 브라우저에게 전송
3. 브라우저는 받은 쿠키를 저장소에 저장
   - 쿠키의 속성(만료 시간, 도메인, 주소 등)도 함께 저장됨
4. 이후 브라우저가 같은 웹 서버에 웹 페이지를 요청할 때, 저장된 쿠키 중 해당 요청에 적용 가능한 쿠키를 포함하여 함께 전송
5. 웹 서버는 받은 쿠키 정보를 확인하고, 필요에 따라 사용자 식별, 세션 관리 등을 수행
6. 웹 서버는 요청에 대한 응답을 보내며, 필요한 경우 새로운 쿠키를 설정하거나 기존 쿠키를 수정할 수 있음

### 쿠키 작동 원리

1. 쿠키 저장 방식
   - 브라우저(클라이언트)는 쿠리를 KEY-VALUE의 데이터 형식으로 저장
   - 쿠키에는 이름, 값 외에도 만료 시간, 도메인, 경로 등의 추가 속성이 포함됨
2. 쿠키 전송 과정
   - 서버는 HTTP 응답 헤더의 Set-Cookie 필드를 통해 클라이언트에게 쿠키를 전송
   - 브라우저는 받은 쿠키를 저장해 두었다가, 동일한 서버에 재요청 시 HTTP 요청 Header의 Cookie 필드에 저장된 쿠키를 함께 전송
3. 쿠키의 주요 용도
   - 두 요청이 동일한 브라우저에서 들어왔는지 아닌지를 판단할 때 주로 사용됨
   - 이를 이용해 사용자의 로그인 상태를 유지할 수 있음
   - 상태가 없는(stateless) HTTP 프로토콜에서 상태 정보를 기억시켜 주는 역할
     > 서버에게 자신이 로그인 된 사용자라는 인증정보가 담긴 쿠키를 매 요청마다 보내는 것!!

### 사용 목적

1. 세션관리
   - 로그인, 아이디 자동완성, 공지 하루 안 보기, 팝업 체크, 장바구니 등의 정보 관리
2. 개인화
   - 사용자 선호 설정(언어 설정, 테마 등) 저장
3. 트래킹
   - 사용자 행동을 기록 및 분석

## 세션

- 서버 측에서 생성되어 클라이언트와 서버 간의 상태를 유지
- 상태 정보를 저장하는 데이터 저장 방식
  > 쿠키에 세션 데이터를 저장하여 매 요청시마다 세션 데이터를 함께 보냄

### 세션 작동 원리

1. 클라이언트가 로그인 요청 후 인증에 성공하면 서버가 session 데이터를 생성 후 저장
2. 생성된 session 데이터에 인증할 수 있는 session id를 발급
3. 발급한 session id를 클라이언트에게 응답(데이터는 서버에 저장, 열쇠만 주는 것)
4. 클라이언트는 응답받은 session id를 쿠키에 저장
5. 클라이언트가 다시 동일한 서버에 접속하면 요청과 함께 쿠키(session id가 저장된)를 서버에 전달
6. 쿠키는 요청 때마다 서버에 함께 전송되므로 서버에서 session id를 확인해 로그인 되어있다는 것을 계속해서 확인하도록 함

# Django Authentication System

- 사용자 인증과 관련된 기능을 모아 놓은 시스템

## 사전 준비

1. 두번째 app accounts 생성 및 등록
   ```bash
   $ python manage.py startapp accounts
   ```
   - auth와 관련한 경로나 키워드들을 django 내부적으로 accounts라는 이름으로 사용하고 있기 때문에 되도록 'accounts'로 지정하는 것을 권장
2. url 설정

   ```py
   # accounts/urls.py

   from django.urls import path
   from . import views

   app_name = 'accounts'
   urlpatterns = [

   ]
   ```

   ```py
   # pjt의 urls.py

   urlpatterns = [
   	# ...
   	path('accounts/', include('accounts.urls')),
   ]
   ```

## Custom User model

- User model 대체하기
  - 내장된 auth 앱에서 제공하는 필드 외에 추가적인 사용자 정보(생년월일, 주소, 나이 등)을 입력받기 위해 Custom User model로 대체 필요
  - 프로젝트의 특정 요구사항에 맞춰 사용자 모델을 확장할 수 있음
  - (예: 이메일을 username으로 사용하거나, 다른 추가 필드를 포함시키거나...)

### Custom User Model로 대체하기

1. AbstractUser 클래스를 상속받는 커스텀 User 클래스 작성

   ```py
   # accounts/models.py

   from django.contrib.auth.models import AbstractUser

   class User(AbstractUser):
   	pass
   ```

2. 기본 장고 User 모델을 커스텀한 User 모델로 대체하기 위해 `AUTH_USER_MODEL` 값 변경

   ```py
   # settings.py

   AUTH_USER_MODEL = 'accounts.User'
   ```

   - `AUTH_USER_MODEL`: Django 프로젝트의 User를 나타내는 데 사용하는 모델을 지정하는 속성
   - ### **프로젝트 중간에 AUTH_USER_MODEL 변경할 수 없음 !!!!!**
   - 반드시 프로젝트 시작 시(첫 migrate 실행하기 전) 대체해야 한다.

3. admin site에 대체한 User 모델 등록

   ```py
   # accounts/admin.py

   from django.contrib import admin
   from django.contrib.auth.admin import UserAdmin
   from .models import User

   admin.site.register(User, UserAdmin)
   ```

## Login

> Session을 생성하는 과정

### AuthenticationForm()

> 로그인 인증에 사용할 데이터를 입력받는 built-in form

### 로그인 페이지 작성

- url 경로 작성

  ```py
  # accounts/urls.py

  app_name = 'accounts'
  urlpatterns = [
  	path('login/', views.login, name='login'),
  ]
  ```

- 로그인 페이지 작성(HTML)
  ```html
  <!-- accounts/login.html -->
  <form action="{% url 'accounts:login' %}" method="POST">
    {% csrf_token %} {{ form.as_p }}
    <input type="submit" />
  </form>
  ```
- view 함수 수정

  ```py
  # accounts/views.py

  from django.contrib.auth.forms import AuthenticationForm
  from django.contrib.auth import login as auth_login

  def login(request):
  	if request.method == 'POST':
  		form = AuthenticationForm(request, request.POST)
  		if form.is_valid():
  			auth_login(request, form.get_user())
  			# get_user: AuthenticalForm의 인스턴스 메서드
  			# 유효성 검사를 통과했을 경우 로그인 한 사용자 객체를 반환
  			return redirect('articles:index')
  	else:
  		form = AuthenticationForm()
  	context = {
  		'form': form,
  	}
  	return render(request, 'accounts/login.html', context)
  ```

## Logout
> 세션을 삭제하는 과정
### logout(request)
1. DB에서 현재 요청에 대한 Session Data를 삭제
2. 클라이언트의 쿠키에서도 Session ID를 삭제

### 로그아웃 로직 작성
- url 경로 작성
   ```py
   # accounts/urls.py

   urlpatterns = [
      path('login/', views.login, name='login'),
      path('logout/', views.logout, name='logout'),
   ]
   ```
- `index.html` 수정
   ```html
   <!-- articles/index.html -->
   <form action="{% url 'accounts:logout' %}" method="POST">
      {% csrf_token %}
      <input type="submit" value="Logout">
   </form>
   ```
- view 함수 수정
   ```py
   # accounts/views.py

   from django.contrib.auth import logout as auth_logout

   def logout(reqeust):
      auth_logout(request)
      return redirect('articles:index')
   ```

## 템플릿과 인증 데이터
### 현재 로그인 되어있는 유저 정보 출력하기
```html
<h3>Hello, {{ user.username }}</h3>
```
#### context processors
- 템플릿이 렌더링 될 때 호출 가능한 컨텍스트 데이터 목록
- 작성된 컨텍스트 데이터는 기본적으로 템플릿에서 사용 가능한 변수로  포함됨
> django에서 자주 사용하는 데이터 목록을 미리 템플릿에 로드해 둔 것

## 참고
### 쿠키 종류별 수명
1. Session cookie
- 현재 세션이 종료되면 삭제됨
- 브라우저 종료와 함께 세션이 삭제됨
2. Persistent Cooies
- Expires 속성에 지정된 날짜 혹은 Max-Age 속성에 지정된 기간이 지나면 삭제됨
