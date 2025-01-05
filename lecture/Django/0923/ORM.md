# ORM
**객체지향 프로그래밍 언어를 사용하여 호환되지 않는 유형의 시스템 간 데이터를 변환하는 기술**

#### ORM의 역할
- Django와 DB간 사용하는 언어가 다르기 때문에 소통 불가
- Django에 내장된 ORM이 중간에서 이를 해석

QuerySet API 요청
응답은 QuerySet or 인스턴스 객체

## QuerySet API
ORM에서 데이터를 검색, 필터링, 정렬 및 그룹화하는데 사용하는 도구
- API를 사용하여 SQL이 아닌 Python 코드로 데이터를 처리


`Article.objects.all()`
- 위 구문으로 ORM에 요청하면 QuerySet(전체 게시글 데이터)를 Django로 받아올 수 있음
    - `Article` : Model class
    - `objects`: Manager
    - `all()`: QuerySet API


### Query
- 데이터베이스에 특정한 데이터를 보여달라는 요청
- 쿼리문을 작성한다 : 원하는 데이터를 얻기 위해 데이터베이스에 요청을 보낼 코드를 작성한다.
- 파이썬코드 -ORM→ SQL → DB에 전달 → 응답데이터 -ORM→ QuerySet

### QuerySet
- 데이터벱이스에게서 전달받은 객체 목록(데이터 모음)
    - 순회가 가능한 데이터(list와 비슷함)로써 1개 이상의 데이터를 불러와 사용할 수 있음
- Django ORM 을 통해 만들어진 자료형
- DB가 단일 객체를 반환할 때는 QuerySet이 아닌 모델(Class)의 인스턴스로 반환됨

## CRUD
- QuerySet API는 python의 모델 클래스와 인스턴스를 활용해 DB에 데이터를 저장(Create), 조회(Read), 갱신(Update), 삭제(Delete)하는 것



- shell 세팅
```bash
$ pip install ipython django-extensions
$ pip freeze > requirements.txt
```
> migrations 폴더(설계도)와 달리 DB는 git에 공유되지 않음
> 따라서 pull 후 makemigrations는 필요 없지만 migrate 는 필요

```py
# settings.py

INSTALLED_APPS = [
    'articles',
    'django_extensions',
    ...
]
```
```bash
$ python manage.py shell_plus
```


### Create
**아래 세가지 방법 모두 필요**

1. 직접 인스턴스 변수 할당하기
    ```shell
    article = Article() # article 인스턴스 생성
    article.title = 'first' # 인스턴스 변수 할당
    article.content = 'django!' # 인스턴스 변수 할당
    Article.objects.all()   # ORM에 요청 (Query)

    # save하지 않으면 DB에 값이 저장되지 않음 -> 응답으로 빈 queryset이 옴

    article.save()  # DB에 데이터 저장(테이블에 한 행 작성) -> pk(id) 생김
    Article.objects.all()   # QuerySet 반환 
    ```

2. 인스턴스 생성 시 인스턴스 변수를 인자로 전달
    ```shell
    article = Article(title='second', content='django!')
    article.save()
    Article.objects.all()
    ```

3. `create()` 메서드 활용 (`save()` 필요 없음)
    ```shell
    Article.objects.create(title='third', content='django!')
    ```


#### `save()`
객체를 DB에 저장하는 **인스턴스 메서드**

### Read
- 새 Queryset 반환
    - all()
    - filter()

- QuerySet 반환 X
    - get()

#### `all()`
- 전체 데이터 조회
#### `filter()`
- 주어진 매개변수와 일치하는 객체를 포함하는 QuerySet 반환
    - `Article.objects.filter(content = 'django!')` : 제목이 'django!'인 QuerySet 반환하기
- 항상 반환은 QuerySet 으로
    - 매개변수와 일치하는 QuerySet 없어도 빈 QuerySet 반환
    - 하나만 있어도 단일 객체가 아닌 QuerySet으로 반환
#### `get()`
- 주어진 매개변수와 일치하는 객체를 반환
    - `Article.objects.get(pk=1)`: pk가 1인 객체 반환
- QuerySet이 아닌 객체를 반환
    - 존재하지 않으면 아무것도 반환하지 않음
    - 매개변수와 일치하는 객체가 여러 개라면 반환하지 않음
    - 따라서 primary key와 같이 고유성을 보장하는 조회에서 사용해야 함.

### Update
- 수정 전 조회 필요
```shell
article = Article.objects.get(pk=2) # pk가 2인 객체 조회
article.content = 'ssafy'   # content 인스턴스 변수 수정
article.save()  # 저장
```

### Delete
- 삭제 전 조회 필요
```shell
article = Article.objects.get(pk=2) # pk가 2인 객체 조회
article.delete()    # 삭제
```
- id가 3인 객체까지 있을 때, id가 2, 3인 객체를 삭제하고 다시 생성하면 그 객체의 id는 4가 됨
    - Django는 삭제된 id를 다시 사용하지 않음


#### Field lookups
- Query에서 조건을 구성하는 방법
- QuerySet 메서드 `filter()`, `exclude()`, `get()`에 대한 키워드 인자로 지정됨
- Django 공식문서 참고 : https://docs.djangoproject.com/en/5.1/ref/models/querysets/

#### ORM, QuerySet API를 사용하는 이유
1. DB 추상화
    - 특정 DB 시스템에 종속되지 않고 일관된 방식으로 데이터를 다룰 수 있음
2. 생산성 향상
    - 복잡한 SQL 쿼리를 직접 작성하는 대신 Python 코드로 DB 작업을 수행할 수 있음
3. 객체지향적 접근
    - DB 테이블을 Python 객체로 다룰 수 있어 객체지향 프로그래밍의 이점을 활용할 수 있음

#### Django ORM Cookbook
Django ORM과 관련하여 자주 등장하는 질문 확인 가능!!! 



