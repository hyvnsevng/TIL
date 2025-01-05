Django 프로젝트 생성
```bash
$ django-admin startproject firstpjt .
```

Django 서버 실행
```bash
$ python manage.py runserver
```

## 디자인패턴
소프트웨어 설계에서 발생하는 공통적인 문제를 해결하는 데 쓰이는 형식화된 관행
> **애플리케이션의 구조는 이렇게 구성하자**는 관행

### MVC 디자인패턴
애플리케이션을 구조화하는 대표적인 패턴
Model(데이터), View(사용자 인터페이스), Controller(비즈니스 로직)을 분리
시각적 요소와 뒤에서 실행되는 로직을 서로 영향 없이, 독립적으로 쉽게 유지보수할 수 있는 어플리케이션 만들기 위해

### MTV 디자인 패턴
Model, Template, View (단순한 명칭 변경)
View → Template
Controller → View

## Project & App
### Project
### App
1. 앱 생성
앱의 이름은 '복수형'으로 지정하는 것을 권장
```bash
#! articles라는 앱 생성
$ python manage.py startapp articles
```
2. 앱 등록
settings.py에서 INSTALLED_APPS 리스트에 앱 등록
주로 커스텀한 앱을 가장 위에 등록

### 프로젝트 구조
- **settings.py**
    * 프로젝트의 모든 설정을 관리
- **urls.py**
    * 요청 들어오는 URL에 따라 이에 해당하는 적절한 views를 연결

### 앱 구조
- **admin.py**
- **models.py**
- **views.py**
- apps.py
- tests.py

## 요청과 응답
url 요청 - urls.py(PJT) - (APP) views.py - models.py(Model) + templates - views.py - 응답

데이터 흐름 순서대로 코드 작성 → 그렇지 않으면 디버깅 시 어려움
URLs → View → Template