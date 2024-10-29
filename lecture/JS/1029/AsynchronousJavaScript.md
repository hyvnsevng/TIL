# 비동기

### 동기

- 프로그램의 실행 흐름이 순차적으로 진행
- 하나의 작업이 완료된 후에 다음 작업이 실행되는 방식

### 비동기

- 특정 작업의 실행이 완료될 때까지 기다리지 않고 다음 작업을 즉시 실행
- 작업의 완료 여부를 신경 쓰지 않고 동시에 다른 작업들을 수행할 수 있음

**특징**

- 병렬적 수행
- 당장 처리를 완료할 수 없고 시간이 필요한 작업들은 백그라운드에서 실행되며 빨리 완료되는 작업부터 처리

# JavaScript와 비동기

### Single Thread

JavaScript는 싱글 스레드 언어

- 스레드란 ?
    - 작업을 처리할 때 실제로 작업을 수행하는 주체
- 즉 JS는 여러 작업을 동시에 처리할 수 없음
- 하나의 작업을 요청한 순서대로 처리할 수 밖에 . .
- 그럼 JS는 어떻게 비동기 처리를 할 수 있을까?

## JavaScript Runtime

- JS가 동작할 수 있는 환경

**브라우저 환경에서의 JavaScript 비동기 처리 관련 요소**

1. Call Stack
    - 요청이 들어올 때마다 순차적으로 처리하는 Stack(LIFO)
    - 기본적인 JavaScript의 Single Thread 작업 처리
2. Web API
    - JavaScript 엔진이 아닌 브라우저에서 제공하는 runtime 환경
    - 시간이 소요되는 작업을 처리 (setTimeout, DOM Event, 비동기 요청 등)
3. Task Queue
    - 비동기 처리된 Callback 함수가 대기하는 Queue(FIFO)
4. Event Loop
    - 태스크( 나중에 쓸 것)
    - Call Stack
    - Call Stack

**정리**

### 브라우저 환경에서의 JavaScript 비동기 처리 동작 방식

스레드

뮤텍스

세마포어

멀티스레드는 자원 공유

멀티프로세스는 . >/ㄴ

# Ajax

비동기적인 Web App 개발을 위한 기술

- `XMLHttpRequest` 기술을 사용해 복잡하고 동적인 웹 페이지를 구성하는 프로그래밍 방식
- 브라우저와 서버 간 데이터를 비동기적으로 교환하는 기술
- 페이지 전체를 새로고침 하지 않고도 동적으로 데이터를 불러와 화면을 갱신할 수 있음
- Ajax의 x는 XML이라는 데이터타입 의미하지만, 요즘은 JSON 더 많이 사용

**목적**

1. 비동기통신
2. 부분 업데이트
3. 서버 부하 감소

### XMLHttpRequest

웹 브라우저와 서버 간의 비동기 통신을 가능하게 하는 JavaScript 객체

- 서버에 HTTP 요청
- 새로고침 없이도 서버로부터 데이터를 가져오거나 보낼 수 있음

### 기존 기술과의 차이

예) 구글맵 : 지도 위치를 이동해도 새로고침 X (사용자가 페이지를 새로 달라고 요청하는 것이 아니라, 지도를 그리기 위한 데이터(XHR 객체)만을 요청)

**이벤트 핸들러는 비동기 프로그래밍의 한 형태**

- 이벤트가 발생할 때마다 콜백함수 제공
- HTTP 요청은 응답이 올 때까지의 시간이 걸릴 수 있는 작업이라 비동기
- 이벤트 핸들러를 XHR 객체에 연결해 요청의 진행 상태 및 최종 완료에 대한 응답 받음

## Axios

브라우저와 Node.js에서 사용할 수 있는 promise 기반의 HTTP 클라이언트 라이브러리

- 클라이언트 및 서버 사이에 HTTP 요청을 만들고 응답을 처리하는 데 사용되는 JS 라이브러리
- 서버와의 HTTP 요청과 응답을 간편하게 처리할 수 있도록 도와주는 도구
- 브라우저를 위한 XHR 객체 생성
- 간편한 API 제공, Promise 기반의 비동기 요청을 처리

### 클라이언트 서버 간 동작(Ajax, Axios)

- XHR 객체 생성 및 요청 → 응답 데이터 생성 → JSON 데이터 응답 → Promise 객체 데이터를 활용해 DOM 조작(웹페이지 일부분만을 다시 로딩)

## Axios 활용

```jsx
<body>
  <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
  <script>
    // 1.
    const promiseObj = axios({
      method: 'get',
      url: 'https://api.thecatapi.com/v1/images/search',
    })

    console.log(promiseObj) // Promise object

    // 2.
    promiseObj
    .then((response) => {
      console.log(response)
      console.log(response.data)
    })
    .catch((error) => {
      console.error(error)
    })
  </script>
</body>
```

**Promise 객체**

- 자바스크립트에서 비동기 작업을 처리하기 위한 객체
- 비동기 작업의 최종 완료(또는 실패)와 그 결과값을 나타냄
- 주요 메서드
    - `then()` : 작업이 성공적으로 완료되었을 때 실행될 콜백 함수를 지정
    - `catch()` : 작업이 실패했을 때 실행될 콜백 함수를 지정

### Axios 기본 구조

- axios 객체를 활용해 요청 보낸 후 응답 데이터 promise 객체를 받음

### 냥냥펀치

```jsx
<body>
  <button>냥냥펀치</button>

  <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
  <script>
    const URL = 'https://api.thecatapi.com/v1/images/search'
    const btn = document.querySelector('button')

    const getCats = function () {
      axios({
        method: 'get',
        url: URL
      })
        .then((response) => {
          const imgUrl = response.data[0].url
          const imgElem = document.createElement('img')
          imgElem.setAttribute('src', imgUrl)
          document.body.appendChild(imgElem)
        })
        .catch((error) => {
          console.log(error)
          console.log('실패했다옹')
        })
      console.log('야옹야옹')
    }

    btn.addEventListener('click', getCats)
  </script>
</body>
```

## Ajax와 Axios

### Ajax

- 하나의 특정한 기술을 의미하는 것이 아니라,
- 비동기적인 Web App 개발에 사용하는 기술들의 집합을 지칭
- 개념이자 접근 방식

### Axios

- 클라이언트 및 서버 사이에 HTTP 요청을 만들고 응답을 처리하는 데 사용되는 자바스크립트 라이브러리
- Promise API를 기반으로 하여 비동기 처리를 더 쉽게 할 수 있음
- Ajax를 실현하는 구체적 도구 중 하나로, XMLHttpRequest를 추상화하여 더 사용하기 쉽게 만든 라이브러리

# Callback과 Promise

### **비동기 처리의 특성**

- 작업이 시작되는 순서가 아니라 **완료되는 순서**에 따라 처리 된다는 것

### **비동기 처리의 어려움**

- 개발자 입장에서 코드의 실행 순서가 불명확함
- 실행결과를 정확히 예측하며 코드를 작성하기 어려울 수 있음

### 비동기 처리 관리 방법

1. **비동기 콜백**
    - 비동기 작업이 완료된 후 실행될 함수를 미리 정의
2. Promise
    - 비동기 작업의 최종 완료 또는 실패를 나타내는 객체

## 비동기 콜백

- 비동기적으로 처리되는 작업이 완료되었을 때 실행되는 함수
- 연쇄적으로 발생하는 비동기 작업을 순차적으로 동작할 수 있게 함
- 작업의 순서와 동작을 제어하거나 결과를 처리하는 데 사용

### 한계

- 콜백지옥
    
    **콜백지옥이란?**
    

### 콜백 함수 정리

- 지옥에 빠지지 않는 다른 표기 형태 필요하다

### 프로미스

JavaScript에서 비동기 작업의 결과를 나타내는 객체

비동기 작업이 완료되었을 때 결과값을 반환하거나, 실패 시 에러를 처리할 수 있는 기능을 제공