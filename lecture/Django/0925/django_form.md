## INTRO
### HTML 'form'
지금까지 사용자로부터 데이터를 제출 받기위해 활용한 방법
- 그러나 비정상적 혹은 악의적인 요청을 필터링 할 수 없음
    - 유효한 데이터인지에 대한 확인 필요

### 유효성 검사
수집한 데이터가 정확하고 유효한지 확인하는 과정
- 해당 기능을 Django가 제공하는 form을 통해 구현

## Django Form
- 사용자 입력 데이터의 수집 처리 및 유효성 검사를 수행하기 위한 도구
- 유효성 검사를 단순화하고 자동화 할 수 있는 기능 제공


1. Form 클래스 정의
```py
# articles/forms.py

from django import forms

class ArticleForm(forms.Form):
    title = forms.CharField(max_length=10)
    content = forms.CharField()
```
2. view 함수 new 변경
```py
# articles/views.py

from .forms import ArticleForm

def new(request):
    form = ArticleForm()
    context = {
        'form': form,
    }
    return render(request, 'articles/new.html', context)
```
3. new 페이지에서 form 인스턴스 출력
```html
<!-- articles/new.html -->

<h1>NEW</h1>
<form action="{% url 'articles:create' %}" method="POST">
  {% csrf token %}
  {{ form }}
  <input type="submit">
</form>
```

#### Form rendering options
- label, input 쌍을 특정 HTML 태그로 감싸는 옵션
```html
<!-- articles/new.html -->

<h1>NEW</h1>
<form action="{% url 'articles:create' %}" method="POST">
  {% csrf token %}
  {{ form.as_p }}
  <input type="submit">
</form>
```

#### Widgets
- HTML 'input' 요소의 속성 및 출력표현 담당


## Django ModelForm
- Model과 연결된 Form을 자동으로 생성해주는 기능
#### Form vs ModelForm
- Form: 사용자 입력 데이터를 DB에 저장하지 않을 때 (검색, 로그인)
- ModelForm: 사용자 입력 데이터를 DB에 저장해야 할 때 (게시글 작성, 회원가입)

1. ModelForm 클래스 정의
    ```py
    # articles/forms.py

    from django import forms
    from .models import Article

    class ArticleForm(forms.Form):
        class Meta:
            model = Article     # 메타데이터
            fields = '__all__'
    ```
- Meta class: ModelForm의 정보를 작성하는 곳
    - Django에서 ModelForm에 대한 추가 정보나 속성을 작성하는 클래스 구조를 Meta 클래스로 작성했을 뿐, 파이썬의 문법적인 관점으로 접근 X
    - fields 및 exclude 속성
        -  exclude 속성을 사용하여 모델에서 포함하지 않을 필드 지정 가능
        ```py
        class ArticleForm(forms.ModelForm):
            class Meta:
                model = Article
                exclude = ('title',)
        ```

2. view 함수 create 및 edit 변경
```py
# articles/views.py

from .forms import ArticleForm


def create(request):
    form = ArticleForm(request.POST)
    if form.is_valid():
        article = form.save()
        return redirect('articles:detail', article.pk)
    context = {
        'form' = form,
    }
    return render(request, 'articles/new.html', context)
```
- `is_valid()` : 여러 유효성 검사를 실행 후 유효 여부를 boolean으로 반환
3. view 함수 edit 및 edit 페이지 변경
```py
# articles/views.py

def edit(request, pk):
    article = Article.objects.get(pk=pk)
    form = ArticleForm(instance=article)
    context = {
        'article': article,
        'form': form,
    }
    return render(request, 'articles/edit.html', context)
```
```html
<!-- articles/edit.html -->

<h1>EDIT</h1>
<form action="{% url 'articles:update' article.pk %}" method="POST">
  {% csrf_token %}
  {{ form.as_p }}
  <input type="submit">
</form>
```
4. view 함수 update 수정
```py
# articles/views.py

def update(request, pk):
    article = Article.objects.get(pk=pk)
    form = ArticleForm(request.POST, instance=article)
    if form.is_valid():
        form.save()
        return redirect('articles:detail', article.pk)
    context = {
        'article': article,
        'form': form,
    }
    return render(request, 'articles/edit.html', context)
```
- `save()`: DB 객체를 만들고 저장하는 ModelForm의 인스턴스 메서드
    - 키워드 인자 instance 여부를 통해 생성할 지, 수정할 지를 결정
    ```py
    # CREATE

    form = ArticleForm(request.POST)
    form.save()
    ```
    ```py
    # UPDATE

    form = ArticleForm(request.POST, instance=article)
    form.save()
    ```

## HTTP 요청 다루기
### View함수 구조 변화
#### new & create
- 공통점 : 데이터 생성 구현 목적
- 차이점 : new는 GET 메서드 요청만을, create는 POST 메서드 요청만을 처리
    - 동일 목적을 가지는 두 view 함수를 하나로 구조화하기

### new & create 결합
- Before:
    ```py
    # articles/views.py

    def new(request):
        form = ArticleForm()
        context = {
            'form': form,
        }
        return render(request, 'articles/new.html', context)

    def create(request):
        form = ArticleForm(request.POST)
        if form.is_valid():
            article = form.save()
            return redirect('articles:detail', article.pk)
        context = {
            'form': form,
        }
        return render(request, 'articles/new.html', context)
    ```
- After:
    ```py
    # articles/views.py

    def create(request):
        if request.method == 'POST':    # POST 메서드 : create
            form = ArticleForm(request.POST)
            if form.is_valid():
                article = form.save()
                return redirect('articles:detail', article.pk)
        else:                           # GET 메서드 : new
            form = ArticleForm()
        context = {
            'form': form,
        }
        return render(request, 'articles/create.html', context)
    ```
    - request 메서드에 따른 분기
        - POST일 때는 과거 create 함수 구조였던 객체 생성 및 저장 로직
        - GET일 때는 과거 new 함수에서 진행했던 form 인스턴스 생성
    - context에 담기는 form은 
        1. is_valid()를 통과하지 못해 에러메시지를 담은 form
        2. else문을 통한 form 인스턴스
    - 이후 처리할 것들:
        1. `articles/urls.py`에서 사용하지 않게 된 new url 제거
        2. `index.htm`l에서 new 관련 키워드를 create로 변경
        3. `views.py` 내 create 함수의 render에서 new 템플릿을 create 템플릿으로 변경

### edit & update 결합
```py
# articles/views.py

def update(request, pk):
    article = Article.objects.get(pk=pk)
    if request.method == 'POST':            # POST : update
        form = ArticleForm(request.POST, instance=article)
        if form.is_valid():
            form.save()
            return redirect('articles:detail', article.pk)
    else:                                   # GET : edit
        form = ArticleForm(instance=article)
    context = {
        'article'=article,
        'form': form,
    }
    return render(request, 'articles/update.html', context)
```

1. `articles/urls.py`에서 사용하지 않는 edit url 제거
2. `detail.html`에서 edit 관련 키워드를 update로 변경


## 참고
### ModelForm의 키워드 인자 구성

```py
# ModelForm의 상위 클래스인 BaseModelForm의 생성자 함수 모습

class BaseModelForm(BaseForm):
    def __init__(self, data=None, files=None, auto_id='id_%s', prefix=None, initial=None, error_class=ErrorList, label_suffix=None, empty_permitted=False, instance=None, use_required_attribute=None, renderer=None):
```
- data는 첫번째 키워드 인자이기 때문에 생략 가능
- instance는 9번째 키워드 인자이기 때문에 생략 불가능
```py
# articles/views.py

form = ArticleForm(request.POST, instance=article)
# data=request.POST 대신 request.POST를 인자로 전달 가능
```

### Widgets 응용

```py
# articles/forms.py

class ArticleForm(forms.ModelForm):
    title = forms.CharField(
        label='제목',
        widget=forms.TextInput(
            attrs={
                'class': 'my-title',
                'placeholder': 'Enter the title',
            }
        ),
    )
    content = forms.CharField(
        label='내용',
        widget=forms.Textarea(
            attrs={
                'class': 'my-content',
                'placeholder': 'Enter the content',
                'rows': 5,
                'cols': 50,
            }
        ),
        error_messages={'required': '내용을 입력해주세요.'},
    )
    class Meta:
        model = Article
        fields = '__all__'
```

### 필드를 수동으로 렌더링하기
```html
{{ form.non_field_errors }}
<form action="..." method="POST">
    {% csrf_token %}
    <div>
        {{ form.title.errors }}
        <label for="{{ form.title.id_for_label }}">Title:</label>
        {{ form.title }}
    </div>
    <div>
        {{ form.content.errors }}
        <label for="{{ form.content.id_for_label }}">Content:</label>
        {{ form.content }}
    </div>
    <input type="submit">
</form> 
```