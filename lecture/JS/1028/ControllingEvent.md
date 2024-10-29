# 이벤트

## 개요

### 웹에서의 이벤트

- 웹에서의 모든 동작은 이벤트 발생과 함께 한다.

## event 객체

- DOM에서 이벤트가 발생했을 때 생성되는 객체
- 이벤트 종류
    - ㅁㄴㅇㄹ

### event

무언가 일어났다는 신호, 사건

- 모든 DOM 요소는 이러한 event를 만들어냄

> DOM 요소에서 event가 발생하면 해당 event는 연결된 이벤트 처리기에 의해 처리됨
> 

## event handler

특정 이벤트가 발생했을 때 실행되는 함수

### **.addEventListener()**

대표적인 이벤트 핸들러 중 하나

특정 이벤트를 DOM요소가 수신할 때 마다 콜백함수 호출

```jsx
EventTarget.addEventListener(type, handler) 
```

- `EventTarget` : DOM 요소(대상에)
- `type` : 수신할 이벤트(특정 이벤트가 발생하면)
- `handler` : 콜백 함수(지정한 이벤트를 받아 할 일을 등록한다)

**addEventListener의 인자**

- type
    - 수신할 이벤트 이름
    - 문자열로 작성(`'click'`)
- handler
    - 발생한 이벤트 객체를 수신하는 콜백 함수
    - 이벤트 핸들러는 자동으로 event 객체를 매개변수로 받음

**활용 예시**

```jsx
// 1. 버튼 선택
const btn = document.querySelector('#btn')

// 2. 콜백 함수
const detectClick = function (event) {
	console.log(event)  // PointerEvent
	console.log(event.currentTarget)  // 이벤트 리스너에 연결된 요소
	console.log(this)	 // addEventListener를 호출한 객체
}

// 3. 버튼에 이벤트 핸들러 부착
btn.addEventListener('click', detectClick)
```

- 이벤트 핸들러 내부의 `this`는 이벤트 리스너에 연결된 요소(`currentTarget`)를 가리킴
- 이벤트가 발생하면 `event`객체가 생성되어 첫번째 인자로 전달
    - 필요 없는 경우 생략 가능
- 반환값 없음

# 버블링

중첩된 요소에 각각 이벤트 핸들러가 연결되어 있을 때 만약 가장 안쪽 요소를 클릭하면?

모든 핸들러 동작

왜?

버블링

- 한 요소에 이벤트가 발생하면 이 요소에 할당된 핸들러가 동작하고 이어서 부모 요소의 핸들러가 동작하는 현상
- 가장 최상단의 조상 요소를 만날 때까지 이 과정이 반복되면서 요소 각각에 할당된 핸들러 동작
- 이벤트가 정확히 어디서 발생했는 지 접근할 수 있는 방법
    - currentTarget
        - 현재 요소
        - 항상 이벤트 핸들러가 연결된 요소만을 참조
        - `this` 와 같음
    - target
        - 이벤트가 발생한 가장 안쪽의 요소 참조
        - 실제 이벤트가 시작된 요소
        - 버블링이 진행되어도 변하지 않음

### 캡쳐링

버블링과 반대로 이벤트가 하위 요소로 전파되는 단계

## 버블링이 필요한 이유

- 만약 각자 다른 동작을 수행하는 버튼이 여러 개 있을 때
- 각 버튼마다 서로 다른 이벤트 핸들러?
- 각 버튼의 공통 조상인 div 요소에 이벤트 핸들러 한 개만 할당
- 여러 버튼 요소에서 발생하는 이벤트 한꺼번에 다룰 수 있음
- target  이용하면 어떤 버튼에서 이벤트 발생했는지 알 수 있기 때문

# event handler 활용

- 클릭하면 숫자가 1씩 증가하는 버튼
    
    ```html
    <body>
      <button id="btn">버튼</button>
      <p>클릭횟수 : <span id="counter">0</span></p>
    
      <script>
        let counterNumber = 0
    
        const btn = document.querySelector('#btn')
    
        const clickHandler = function () {
          counterNumber += 1
          const spanTag = document.querySelector('#counter')
          spanTag.textContent = counterNumber
        }
    
        btn.addEventListener('click', clickHandler)
        
      </script>
    </body>
    ```
    
- 사용자 입력 값 실시간으로 출력
    
    ```html
    <body>
      <input type="text" id="text-input">
      <p></p>
    
      <script>
        const inputTag = document.querySelector('#text-input')
    
        const pTag = document.querySelector('p')
    
        const inputHandler = function (event) {
          console.log(event.currentTarget.value)
          pTag.textContent = event.currentTarget.value
        }
    
        inputTag.addEventListener('input', inputHandler)
      </script>
    </body>
    ```
    
    - `console.log()` 로 event 객체 출력 시 `currentTarget` 키의 값은 null을 가짐(이벤트 처리되는 동안에만 사용 가능)
    - `console.log(event.currentTarget)` 을 통해 콘솔에서 확인 가능
    - `currentTarget` 이후의 속성 값들은 `target` 사용
- 사용자 입력 값 실시간으로 출력 및 ‘+’ 버튼 클릭 시 출력한 값의 CSS 스타일 변경
    
    ```html
    <head>
      <style>
        .blue {
          color: blue;
        }
      </style>
    </head>
    
    <body>
      <h1></h1>
      <button id="btn">클릭</button>
      <input type="text" id="text-input">
    
      <script>
        const inputTag = document.querySelector('#text-input')
        const h1Tag = document.querySelector('h1')
    
        const inputHandler = function (event) {
          h1Tag.textContent = event.currentTarget.value
        }
    
        inputTag.addEventListener('input', inputHandler)
    
        const btn = document.querySelector('#btn')
    
        const clickHandler = function () {
          // 1. add
          // h1Tag.classList.add('blue')
    
          // 2. toggle
          h1Tag.classList.toggle('blue')
        }
    
        btn.addEventListener('click', clickHandler)
      </script>
    </body>
    ```
    
- todo 작성
    
    ```html
    <body>
      <input type="text" class="input-text">
      <button id="btn">+</button>
      <ul></ul>
    
      <script>
        const inputTag = document.querySelector('.input-text')
        const btn = document.querySelector('#btn')
        const ulTag = document.querySelector('ul')
    
        const addTodo = function (event) {
          const inputData = inputTag.value
          const liTag = document.createElement('li')
    
          liTag.textContent = inputData
          ulTag.appendChild(liTag)
          inputTag.value = ''
        }
        
        btn.addEventListener('click', addTodo)
      </script>
    </body>
    ```
    
    - todo 추가 기능 구현
        
        ```jsx
        const addTodo = function (event) {
          const inputData = inputTag.value
          if (inputData.trim()) {
            const liTag = document.createElement('li')
            liTag.textContent = inputData
            ulTag.appendChild(liTag)
            inputTag.value = ''
          } else {
            alert('할 일을 입력하세요.')
          }
        }
        ```
        
        - 빈 문자열 입력 방지
        - 입력이 없을 경우 경고 대화상자 띄우기
- 로또 번호 생성기
    
    ```jsx
    <body>
      <h1>로또 추천 번호</h1>
      <button id="btn">행운 번호 받기</button>
      <div></div>
    
      <script src="https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js"></script>
      <script>
        const btn = document.querySelector('#btn')
        const divTag = document.querySelector('div')
    
        const getLottery = function (event) {
          const numbers = _.range(1, 46)
          const sixNumbers = _.sampleSize(numbers, 6)
          const ulTag = document.createElement('ul')
    
          sixNumbers.forEach(number => {
            const liTag = document.createElement('li')  // liTag 생성
            liTag.textContent = number  // liTag 값 입력
            ulTag.appendChild(liTag)  // liTag 내용을 ulTag에 추가
          })
    
          divTag.appendChild(ulTag) // ulTag 내용을 divTag에 추가
        }
    
        btn.addEventListener('click', getLottery) // 이벤트 핸들러 호출 
      </script>
    </body>
    ```
    
    - **lodash**
        - **JavaScript에서 array, object 등 자료구조를 다룰 때 사용하는 유용하고 간편한 함수들을 제공하는 유틸리티 라이브러리**

## 이벤트 기본 동작 취소하기

- HTML의 각 요소가 기본적으로 가지고 있는 이벤트가 때로는 방해가 되는 경우가 있어 기본 동작 취소할 필요가 있음
- 예시
    - 페이지 새로고침 막기(form 요소의 제출 이벤트 취소)
    - 페이지 이동을 막고 추가 로직 수행(a 요소의 이벤트 취소)
    - 콘텐츠 복사 금지(copy 이벤트의 동작 취소)

### `.preventDefault()`

- copy 이벤트 동작 취소

# 참고