## Static files
서버 측에서 변경되지 않고 고정적으로 제공되는 파일(이미지, JS, CSS 등)
### Static files 제공하기
#### 웹 서버와 정적 파일
- 웹 서버의 기본 동작은 특정 위치(URL)에 있는 자원을 요청(HTTP request) 받아서 응답(HTTP response)을 처리하고 제공하는 것
- 이는 `자원에 접근 가능한 주소가 있다`라는 의미
- 웹서버는 요청받은 URL로 서버에 존재하는 정적 자원을 제공함
- `정적 파일을 제공하기 위한 경로`가 있어야 함

### Static files 기본 경로
`app폴더/static/`

1. `articles/static/articles` 경로에 이미지 파일 배치
2. html 파일에 static tag 이용해서 static 파일 경로 작성
    ```html
    <!--
    1. load tag는 extends tag 이후에 작성해야 한다.(extends tag는 파일 최상단에 작성해야 함)
    2. load tag는 상속되지 않는다.
        -->
    {% load static %}

    <img src="{% static "articles/sample-1.png" %}" alt="sample-image">
    ```
    - built-in tag가 아니기 때문에 load tag를 사용해 import 후 사용가능
3. 개발자 도구에서 STATIC_URL 확인

**STATIC_URL**
- 기본 경로 및 추가 경로에 위치한 정적 파일을 참조하기 위한 URL
    - 'URL + STATIC_URL + 정적파일 경로(로컬)'가 정적 파일의 URL이 됨
    - 실제 파일이나 디렉토리 경로가 아니며, URL로만 존재
    - settings.py에서 STATIC_URL 변경 가능

### Static files 추가 경로
STATICFILES_DIRS에 문자열 값으로 추가 경로 설정
1. settings.py에 추가 경로 설정
    ```py
    # settings.py

    STATICFILES_DIRS = [
        BASE_DIR / 'static',
    ]
    ```
2. 추가 경로에 이미지 파일 배치
    - 예시에서는 BASE_DIR/static/sample-2.png
3. static tag를 사용해 이미지 파일에 대한 경로 제공
4. 이미지를 제공받기 위해 요청하는 Request URL 확인
    - 정적 파일을 제공하려면 요청에 응답하기 위한 URL이 필요


## Media files
사용자가 웹에서 업로드하는 정적 파일
### 이미지 업로드

**사전 준비**
1. settings.py에 MEDIA_ROOT, MEDIA_URL 설정
    ```py
    # settings.py

    MEDIA_ROOT = BASE_DIR / 'media'
    MEDIA_URL = 'media/'
    ```
    - MEDIA_ROOT : 미디어 파일들이 위치하는 디렉토리의 절대 경로
    - MEDIA_URL : MEDIA_ROOT에서 제공되는 미디어 파일에 대한 주소를 생성
2. 작성한 MEDIA_ROOT와 MEDIA_URL에 대한 URL 지정
    ```py
    from django.conf import settings
    from django.conf.urls.static import static

    urlpatterns = [
        ...
    ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    ```

- ImageField()
    - 이미지 업로드에 사용하는 모델 필드
    - 이미지 객체가 직접 DB에 저장되는 것이 아닌 '이미지 파일의 경로' 문자열이 저장됨. 즉, 근본적으로는 문자열 필드

**이미지 업로드**
1. models.py에 이미지를 입력받을 ImageField 설정
    - blank=True 속성으로 빈 문자열이 저장될 수 있도록 제약조건 설정
        - 기본적으로 Field는 공백을 입력받지 않음
        - 게시글 작성 시 이미지 업로드 없이도 작성할 수 있도록 하기 위함
    ```py
    # articles/models.py

    class Article(models.Model):

        title = models.CharField(max_length=10)
        content = models.TextField()
        image = models.ImageField(blank=True)
        created_at = models.DateTimeField(auto_now_add=True)
        updated_at = models.DateTimeField(auto_now=True)
    ```
2. migration 진행
    - ImageField를 이용하려면 반드시 pillow 라이브러리 설치 필요
    ```bash
    $ pip install pillow

    $ python manage.py makemigrations
    $ python manage.py migrate

    $ pip freeze > requirements.txt
    ```
3. form 요소의 enctype 속성(데이터 전송방식 결정) 추가
    ```html
    <!-- articles/create.html -->

    <h1>Create</h1>
    <form action="{% url "articles:create" %}" method="POST" enctype="multipart/form-data">
        {% csrf_token %}
        {{ form.as_p }}
        <input type="submit">
    </form>   
    ```
4. create의 view 함수에서 ModelForm의 2번째 인자로 요청받은 파일 데이터 작성
    ```py
    # articles/views.py

    def create(request):
    if request.method == 'POST':
        form = ArticleForm(request.POST, request.FILES)
    ...
    ```
    - 파일은 request.FILES를 통해 받을 수 있음
5. 개발자 도구에서 이미지 업로드 input 확인
6. DB에서 이미지 업로드 결과 확인

### 업로드 이미지 제공
1. detail.html 수정
    ```html
    <!-- articles/detail.html -->

    <img src="{{ article.image.url }}" alt="img">
    ```
    - 'url' 속성을 통해 업로드 파일의 경로 값을 얻을 수 있음
    - article.image.url: 업로드 파일의 경로
    - article.image: 업로드 파일의 파일 이름
2. 업로드 이미지 출력 확인 및 개발자 도구에서 MEDIA_URL 확인
3. 이미지가 있는 경우만 이미지 출력할 수 있도록 처리하기
    ```html
    <!-- articles/detail.html -->

    {% if article.image %}
        <img src="{{ article.image.url }}" alt="img">
    {% endif %}
    ```
    - 이미지를 업로드하지 않은 게시물은 detail 템플릿을 렌더링 할 수 없음


### 업로드 이미지 수정
1. update(수정 페이지) html파일의 form 요소에 enctype 속성 추가
    ```html
    <!-- articles/update.html -->

    <h1>Update</h1>
    <form action="{% url 'articles:update' article.pk %}" method="POST" enctype="multipart/form-data">
      {% csrf_token %}
      {{ form.as_p }}
      <input type="submit" value="수정">
    </form>
    ```
2. update view 함수에서 업로드 파일에 대한 추가 코드 작성
    ```py
    def update(request, pk):
        article = Article.objects.get(pk=pk)
        if request.method == 'POST':
            form = ArticleForm(request.POST, request.FILES, instance=article)
    ```
## 참고
### 미디어 파일 추가 경로
- ImageField()의 upload_to 속성을 사용해 다양한 추가 경로 설정
    ```py
    # 1. 기본 경로 설정(단순 문자열)
    image = models.ImageField(blank=True, upload_to='images/')

    # 2. 업로드 날짜로 경로 설정
    image = models.ImageField(blank=True, upload_to='%Y/%m/%d/')

    # 3. 함수 형식으로 경로 설정
    def articles_image_path(instance, filename):
        return f'images/{instance.user.username}/{filename}'
    image = models.ImageField(blank=True, upload_to=articles_image_path)
    ```

### BaseModelForm
- request.FILES가 두번째 위치 인자인 이유?
    ```py
    class BaseModelForm:
        def __init__(
            self, 
            data=None, 
            files=None, 
            auto_id='id_%s', 
            prefix=None, 
            initial=None, 
            error_class=ErrorList, 
            label_suffix=None, 
            empty_permitted=False, 
            instance=None, 
            use_required_attribute=None,
            renderer=None,
        ):
    ```
    - ModelForm의 상위 클래스인 BaseModelForm의 생성자 함수 키워드 인자 중 두번째 인자가 files
    - ModelForm 사용 시 request.FILES의 키워드를 입력해주지 않아도 됨