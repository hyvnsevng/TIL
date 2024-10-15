# N:M 관계

> 한 테이블의 0개 이상의 레코드가 다른 테이블의 0개 이상의 레코드와 관련된 경우
> 양쪽 모두에서 N:1 관계를 가짐

두 개의 모델 : 서로 참조와 역참조 관계

## N:1의 한계

한 명의 의사에게 여러 환자가 예약할 수 있도록 설계한다면

1번 환자가 두 의사 모두에게 진료를 받고자 한다면 환자 테이블에 1번 환자 데이터가 중복으로 입력될 수 밖에 없음
→ 동시에 예약을 남길 수는 없을까 ?

- 동일한 환자지만 다른 의사에게도 진료받기 위해 예약하기 위해서는 객체를 하나 더 만들어 진행해야 함
- **예약 테이블을 따로 만들자.**

## 중개 모델

**1. 예약 모델 생성**

- 환자 모델의 외래 키를 삭제하고 별도의 예약 모델을 새로 생성
- 의사와 환자에 각각 N:1 관계를 가짐

**2. 예약 데이터 생성**

- DB 초기화 후 Migration, shell_plus 실행
- 의사와 환자 생성 후 예약 만들기

**3. 예약 정보 조회**

- 의사와 환자가 예약 모델을 통해 각각 본인의 진료 내역 확인

**4. 추가 예약 생성**

- 1번 의사에게 새로운 환자 예약 생성

**5. 예약 정보 조회**

## ManyToManyField()

> Django가 제공하는 M:N 관계 설정 모델 필드
> 중개모델 자동 생성

**1. 환자 모델에 ManyToManyField 작성**

   ```py
   # hospitals/model.py

   class Patient(models.Model):
   	doctors = models.ManyToManyField(Doctor)
   	name = models.TextField()

   	def __str__(self):
   		return f'{self.pk}번 환자 {self.name}'

   # Reservation Class는 더이상 필요 없다.
   ```

   - 의사 모델, 환자 모델 어디 작성해도 상관 없음
   - 참조/역참조 관계만 잘 기억할 것

**2. DB 초기화 후 Migration, 중개테이블 확인**

   - shell_plus 실행

**3. 의사 1명과 환자 2명 생성**
   ```py
   doctor1 = Doctor.objects.create(name='allie')
   patient1 = Patient.objects.create(name='carol')
   patient2 = Patient.objects.create(name='duke')
   ```
**4. 예약 생성(환자가 예약)**

   ```py
   patient1.doctors.add(doctor1)
   ```

**5. 예약 생성(의사가 예약)**
   ```python
   doctor1.patient_set.add(patient2)
   ```
**6. 중개테이블에서 예약 현황 확인**

**7. 예약 취소(삭제)**

   ```py
   # doctor1이 patient1 진료 예약 취소
   doctor1.patient_set.remove(patient1)

   # patient2가 doctor1 진료 예약 취소
   patient2.doctors.remove(doctor1)
   ```

   - 한 쪽에서만 취소해도 양 쪽 데이터 모두 삭제됨
   - 이전에는 Reservation을 찾아서 지워야 했다면, 이제는 .remove()로 삭제 가능

## 'through' argument

> 중개 테이블에 '추가 데이터'를 사용해 M:N 관계를 형성하려는 경우에 사용

- 만약 예약 정보에 병의 증상, 예약일 등 추가 정보가 포함되어야 한다면?

**1. Reservation class 재작성 및 through 설정**

   - 이제는 예약 정보에 증상과 예약일이라는 추가 데이터 생김

   ```py
   class Patient(models.Model):
   	doctors = models.ManyToManyField(Doctor, through='Reservation')
   	# ...


   class Reservation(models.Model):
   	doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)
   	patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
   	symptom = models.TextField()
   	reserved_at = models.DateTimeField(auto_now_add=True)
   	# ...
   ```

**2. DB 초기화 후 Migration, shell_plus에서 의사 1명과 환자 2명 생성**

**3. 예약 생성 방법 1**
   - Reservation 클래스 통한 예약 생성
   ```py
   reservation1 = Reservation(doctor=doctor1, patient1, symptom='headache')
   reservation1.save()
   ```
**4. 에약 생성 방법 2**
   - Patient 또는 Doctor의 인스턴스를 통한 예약 생성(`through_defaults`)
   ```py
   patient2.doctors.add(doctor1, through_defaults={'symptom': 'flu'})
   ```
**5. 생성된 예약 확인**

**6. 마찬가지로 환자와 의사 쪽 모두에서 예약 삭제 가능**

   ```py
   # 의사가 예약 취소
   doctor1.patient_set.remove(patient1)

   # 환자가 예약 취소
   patient2.doctors.remove(doctor1)
   ```

## M:N 관계 주요 사항

- M:N 관계로 맺어진 두 테이블에는 물리적 변화 없음
- 중개 테이블
  - 두 모델 어디에 위치해도 상관 없음
  - 대신 필드 작성 위치에 따라 참조와 역참조 방향 주의
- M:N은 종속적 관계 X
- 양쪽에서 2가지 형태 모두 표현 가능
  - 의사에게 진찰받는 환자
  - 환자를 진찰하는 의사
  

### ManyToManyField 특징
- 양방향 관계
	- 어느 모델에서든 관련 객체에 접근할 수 있음
- 중복 방지
	- 동일한 관계는 한 번만 저장됨

**ManyToManyField의 대표 인자 3가지**
1. related_name
2. symmetrical
3. through

**1. related_name**
- 역참조시 사용하는 manager name 변경
	```py
	class Patient(models.Model):
		doctors = models.ManyToManyField(Doctor, related_name='patients')
		...
	```
	```py
	# 변경 전
	doctor.patient_set.all()

	# 변경 후
	docctor.patients.all()
	```

**2. symmetrical**
- 관계 설정 시 대칭 유무 설정
- ManyToManyField 가 동일한 모델을 가리키는 정의(재귀적 관계)에서만 사용
	- 예: 친구, 또는 팔로우의 경우 User 모델 - User 모델의 N:M 관계
- True일 경우
	- source 모델의 인스턴스가 target 모델의 인스턴스를 참조하면 자동으로 target 모델 인스턴스도 source 모델 인스턴스를 자동으로 참조하도록 함
	- 즉, A가 B의 친구라면 B도 A의 친구로 자동으로 등록됨
	- 기본값 : True
- False일 경우
	- 대칭되지 않음

**3. through**
- 사용하고자 하는 중개모델 지정
- 일반적으로 추가 데이터를 M:N 관계와 연결하려는 경우에 활용

### M:N에서의 대표 조작 메서드
- `add()`: 관계 추가(지정된 객체를 관련 객체 집합에 추가)
- `remove()`: 관계 제거(관련 객체 집합에서 지정된 모델 객체를 제거)


# 좋아요 기능 구현
## 모델 관계 설정
- 게시글 : 사용자
- 한 게시글에 여러 사용자가 좋아요 누를 수 있음
- 한 명의 사용자가 여러 게시글에 좋아요 누를 수 있음
- M:N 관계

1. Article 클래스에 ManyToManyField 작성

	```py
	# articles/models.py

	class Article(models.Model):
		...
		# user 모델 참조 시 직접 참조하지 않고 settings.AUTH_USER_MODEL 통해 참조
		like_users = models.ManyToManyField(settings.AUTH_USER_MODEL)
		...
	```
2. 바로 migration 진행 시 오류
	- 역참조 매니저 충돌
		- 유저가 작성한 게시글(N:1) : `user.article_set.all()`
		- 유저가 좋아요 한 게시글(M:N) : `user.article_set.all()`
		- Article - User 관계와 Article - LikeUsers 관계가 같은 이름의 매니저 사용
		- 따라서 ForeignKey(N:1) 또는 ManyToManyField(M:N) 둘 중 하나에 `related_name` 작성 필요
			- 주로 ManyToManyField 측에서 작성
3. `related_name` 작성 후 migration
	```py
	# articles/models.py

	class Article(models.Model):
		...
		like_users = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='like_articles')
		...
	```

**User-Article 간 사용 가능한 전체 매니저**
- `article.user`
	- 게시글을 작성한 유저 (N:1)
- `user.article_set`
	- 유저가 작성한 게시글 (N:1, 역참조)
- `article.like_users`
	- 게시글을 좋아요 한 유저 (M:N)
- `user.like_articles`
	- 유저가 좋아요 한 게시글 (M:N, 역참조)

## 기능 구현
**1. url 작성**
```py
# articles/urls.py

urlpatterns = [
	...
	path('<int:article_pk/likes/', views.likes, name='likes'),
	...
]
```

**2. view함수 작성**
```py
# articlese/views.py

@login_required
def likes(request, article_pk):
	article = Article.objects.get(pk=article_pk)
	# 좋아요 버튼 누를 때
	if request.user in article.like_users.all():	# 요청을 보낸 사용자가 게시글 좋아요 한 유저 목록에 있을 경우(이미 좋아요 누른 경우)
		article.like_users.remove(request.user)		# 좋아요 취소
	else:	# 좋아요 안 누른 상태면
		article.like_users.add(request.user)	# 좋아요 처리
	return redirect('articles:index')
```
- 좋아요는 메인 페이지에서 POST 요청밖에 오지 않는다.
- 따라서 method가 POST일 때와 아닐 때로 나눌 필요 없다.

**3. index 템플릿에서 좋아요 버튼 출력**
```html
<!-- articles/index.html -->

{% for article in articles %}
	...
	<form action="{% url 'articles:likes' article.pk %}" method='POST'>
		{% csrf_token %}
		{% if request.user in article.like_users.all %}
			<input type="submit" value="좋아요 취소">
		{% else %}
			<input type="submit" value="좋아요">
		{% endif %}
	</form>
	<hr>
{% endfor %}
```