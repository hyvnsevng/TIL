# 회원가입
> User 객체를 생성하는 과정
## UserCreationForm()
- 회원 가입시 사용자 입력 데이터를 받는 built-in ModelForm
### 회원가입 페이지 작성
- url 경로 작성
    ```py
	# accounts/urls.py

	app_name = 'accounts'
	urlpatterns = [
		...,

	]
    ```
- 회원가입 html 파일 작성
	```html
	<h1>회원가입</h1>
	<form action="{% url "accounts:signup" %}" method="POST">
		{% csrf_token %}
		{{ form.as_p }}
		<input type="submit">
	</form>
  	```
- view함수에 회원가입 로직 작성
	```py
	def signup(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('articles:index')
    else:
        form = UserCreationForm()
    context = {
        'form': form,
    }
    return render(request, 'accounts/signup.html', context)
	```

### 커스텀 유저 모델 사용하기 위한 Form 재작성
- 위와 같이 작성한 후 회원가입을 시도하면 오류 발생
	- 회원가입에 사용하는 UserCreationForm이 대체한 커스텀 유저 모델이 아닌 과거 Django의 기본 유저 모델로 작성된 클래스이기 때문
	- → `class Meta: model = User`이 작성된 `UserCreationForm`, `UserChangeForm` 재작성 필요

- accounts 앱에 form 작성
	```py
	# accoutns/forms.py
	# Django는 User 모델을 직접 참조하는 것을 권장하지 않음
	# Django가 제공하는 User 모델 직접 참조하는 방법: import get_user_model
	from django.contrib.auth import get_user_model
	from django.contrib.auth.forms import UserCreationForm, UserChangeForm


	class CustomUserCreationForm(UserCreationForm):
		class Meta(UserCreationForm.Meta):
			model = get_user_model()


	class CustomUserChangeForm(UserChangeForm):
		class Meta(UserChangeForm.Meta):
			model = get_user_model()
	```
	- Django는 User 모델을 직접 참조하는 것을 권장하지 않음
	- Django가 User 모델 직접 참조하는 방법을 제공함
		- `get_user_model()`통해 참조

# 회원탈퇴
> User 객체를 삭제하는 과정
- url 경로 추가
	```py
	# accounts/urls.py

	app_name = 'accounts'
	urlpatterns = [
		...,
		path('delete/', views.delete, name='delete'),
	]
	```
- index.html에 회원탈퇴 버튼 만들기
	```html
	<form action="{% url 'accounts:delete' %}" method='POST'>
		{% csrf_token %}
		<input type="submit" value='회원탈퇴'>
	</form>
	```
- view함수에 탈퇴 로직 작성
	```py
	def delete(request):
		# User 모델에서 누가 회원탈퇴를 요청한건지 검색
		# => User 객체는 요청에 들어있기 때문에 필요 없음
		request.user.delete()
		return redirect('articles:index')
	```
# 회원정보 수정
## UserChangeForm()
- 회원정보 수정 시 사용자 입력 데이터를 받는 built-in ModelForm
### 회원정보 수정 페이지 작성
- url 경로 작성
	```py
	# accounts/urls.py

	urlpatterns = [
		...,
		path("update/", views.update, name="update"),
	]
	```
- accounts/update.html 작성
	```html
	<h1>회원정보 수정</h1>
		<form action="{% url "accounts:update" %}" method='POST'>
		{% csrf_token %}
		{{ form.as_p }}
		<input type="submit">
	</form>
	```

- view함수에 update 로직 작성
	```py
	if request.method == 'POST':
        form = CustomUserChangeForm(request.POST, instance=request.user)
        if form.is_valid():
            form.save()
            return redirect('articles:index')
    else:
        form = CustomUserChangeForm(instance=request.user)
    context = {
        'form': form,
    }
    return render(request, 'accounts/update.html', context)
	```

### UserChangeForm 사용 시 문제점
- User 모델의 모든 정보들(fields)까지 모두 출력됨
- 일반 사용자들이 접근해서는 안되는 정보는 출력하지 않도록 해야 함
> CustomUserChangeForm에서 출력 필드를 다시 조정하기
```py
# accounts/forms.py

class CustomUserChangeForm(UserChangeForm):
    class Meta(UserChangeForm.Meta):
        model = get_user_model()
		fields = ('first_name', 'last_name', 'email',)
```

## PasswordChangeForm()
- 비밀번호 변경 시 사용자 입력 데이터를 받는 built-in Form
### 비밀번호 변경 페이지 작성
- url 경로 설정(pjt의 urls.py)
	```py
	# crud/urls.py

	from accounts import views

	urlpatterns = [
		...,
		path("<user_pk>/password/", views.change_password, name="change_password"),
	]
	```
- view함수에 로직 작성
	- `PasswordChangeForm()`은 첫번째 인자로 user 객체를 받음
	- 따라서 사용 시 첫번째 인자에 `request.user` 포함
	```py
	from django.contrib.auth.forms import AuthenticationForm, PasswordChangeForm

	def change_password(request, user_pk):
		if request.method == 'POST':
			form = PasswordChangeForm(request.user, request.POST)
			# form = PasswordChangeForm(user=request.user, data=request.POST)
			if form.is_valid():
				form.save()
				return redirect('articles:index')
		else:
			form = PasswordChangeForm(request.user)
			
		context = {
			'form': form,
		}
		return render(request, 'accounts/change_passsword.html', context)
	```
	
- html 페이지 작성
	```html
	<h1>비밀번호 변경</h1>
	<form action="{% url "change_password" user.pk %}" method='POST'>
		{% csrf_token %}
		{{ form.as_p }}
		<input type="submit">
	</form>
	```

## 세션 무효화 방지
- 위와 같이 코드 수정 후 비밀번호 변경 시 자동으로 로그아웃 됨
- 클라이언트에서 과거의 세션ID와 함께 요청을 보내기 때문에 비밀번호 변경 후와 회원 인증 정보가 일치하지 않음
## update_session_auth_hash(request, user)
- 암호 변경 시 세션 무효화를 막아주는 함수
> 암호가 변경되면 새로운 암호의 Session Data로 기존 세션을 자동으로 갱신
### 세션 무효화 방지 적용
- accounts/views.py 수정
	```py
	# accounts/views.py

	from django.contrib.auth import update_session_auth_hash

	def change_password(request):
    if request.method == 'POST':
        form = PasswordChangeForm(request.user, request.POST)
        if form.is_valid():
			# 수정: update_session_auth_hash 적용
            user = form.save()
            update_session_auth_hash(request, user)
            return redirect('articles:index')
    else:
        form = PasswordChangeForm(request.user)
        
    context = {
        'form': form,
    }
    return render(request, 'accounts/change_passsword.html', context)
	```
# 인증된 사용자에 대한 접근 제한
1. `is_authenticated` 속성
2. `login_required` 데코레이터
## is_authenticated
- 사용자가 인증되었는지 여부를 알 수 있는 User model의 속성
	- 모든 User 객체에 대해 항상 True인 읽기 전용 속성
	- 비인증 사용자에 대해서는 항상 False
### 적용
- 로그인과 비로그인 상태에서 화면에 출력되는 링크를 다르게 설정
	```html
	<!-- articles/index.html -->
	{% if request.user.is_authenticated %}
		<h3>안녕하세요 {{ user.username }}</h3>
		<a href="{% url "articles:create" %}">NEW</a>
		<form action="{% url "accounts:logout" %}" method="POST">
			{% csrf_token %}
			<input type="submit" value="Logout">
		</form>
		<form action="{% url "accounts:delete" %}" method='POST'>
			{% csrf_token %}
			<input type="submit" value='회원탈퇴'>
		</form>
		<a href="{% url "accounts:update" %}" method='POST'>회원정보 수정</a>
	{% else %}
		<a href="{% url "accounts:login" %}">Login</a>
		<a href="{% url "accounts:signup" %}">Signup</a>
	{% endif %}
	```
- 인증된 사용자라면 로그인/회원가입 로직을 수행할 수 없도록 view함수 수정
	```py
	def login(request):
		if request.user.is_authenticated:
			return redirect('articles:index')
			...

	def signup(request):
		if request.user.is_authenticated:
			return redirect('articles:index')
			...
	```
## login_required
- 인증된 사용자에 대해서만 view함수를 실행시키는 데코레이터
	- 비인증 사용자의 경우 /accounts/login/ 주소로 redirect 시킴
	- 인증과 관련된 앱 이름을 accounts로 하면 편리한 이유

### 적용
- 인증된 사용자만 게시글을 작성/수정/삭제할 수 있도록 수정
	- articles/views.py 수정
	```py
	# articles/views.py

	from django.contrib.auth.decorators import login_required

	@login_required
	def create(request):
		pass
	
	@login_required
	def delete(request):
		pass	
	
	@login_required
	def update(request):
		pass
	```
- 인증된 사용자만 로그아웃/탈퇴/수정/비밀번호 변경 할 수 있도록 수정
	- accounts/views.py 수정
	```py
	# accounts/views.py

	from django.contrib.auth.decorators import login_required

	@login_required
	def logout(request):
		pass
			
	@login_required
	def delete(request):
		pass
	
	@login_required
	def update(request):
		pass
			
	@login_required
	def change_password(request):
		pass
	```

# 참고
## is_authenticated 코드
- 메서드가 아닌 속성값
- https://github.com/django/django/blob/main/django/contrib/auth/base_user.py
	```py
	@property
    def is_authenticated(self):
        """
        Always return True. This is a way to tell if the user has been
        authenticated in templates.
        """
        return True
	```
## 회원가입 후 자동 로그인
- 회원가입 후 로그인까지 이어서 진행하려면 회원가입 성공한 user 객체를 활용해 login 진행
	```py
	# acconts/views.py
	
	def signup(request):
		if request.user.is_authenticated:
			return redirect('articles:index')
		if request.method == 'POST':
			form = CustomUserCreationForm(request.POST)
			if form.is_valid():
				# 수정 코드
				user = form.save()
				auth_login(request, user)
				return redirect('articles:index')
		else:
			form = CustomUserCreationForm()
		context = {
			'form': form,
		}
		return render(request, 'accounts/signup.html', context)
	```

## 회원탈퇴 개선
- 탈퇴와 함께 기존 사용자의 Session Data를 삭제하려면 사용자 객체 삭제 후 로그아웃 함수 호출
	- 단, `탈퇴(1) 후 로그아웃(2)`의 순서가 바뀌면 안됨
	- 먼저 로그아웃이 진행되면 해당 요청 객체 정보가 없어지기 때문에 탈퇴에 필요한 유저 정보 또한 없어지기 때문

	```py
	#  accounts/views.py

	def delete(request):
		request.user.delte()
		auth_logout(request)
	```

## PasswordChangeForm의 인자
- https://github.com/django/django/blob/4.2/django/contrib/auth/forms.py#L378
- 부모 클래스인 SetPasswordForm의 생성자 함수 구성을 따르기 때문에 user 객체를 첫번째 인자로 받음
