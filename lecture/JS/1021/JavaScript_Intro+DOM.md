## JavaScript의 역사

### 웹 브라우저와 JavaScript
- 기존의 웹 브라우저는 정적인 텍스트 페이지만을 지원
- 웹 브라우저의 대중화
- 웹의 동적 기능 개발 위해 스크립트 언어 Mocha 개발
- Mocha -> LiveScript -> JavaScript
- MS가 인터넷 익스플로러에 JavaScript와 유사한 언어인 JScript 도입
- 이 과정에서 많은 회사들이 독자적으로 JavaScript를 변경하고 이를 자체 브라우저에 탑재(JS 파편화)
#### 1차 브라우저 전쟁

- IE vs. Netscape(이후 나와서 Firefox 출시)
- IE 승
- 웹 표준의 부재로 인해 각 기업에서 자체 표준 확립하려는 상황 발생
- 웹개발자들에게 큰 혼란, 웹 표준의 중요성 상기
- Netscape는 ECMA 재단에 웹 표준 제작 요청
- ECMAScript라는 표준 언어 정의하여 발표
- JavaScript는 ECMAScript표준에 기반을 두고 발전 시작

#### 2차 브라우저 전쟁
- IE는 웹표준 지키지 않고 웹 시장 주도
- 크롬 등장
- 빠른 성능, 다양한 플랫폼 지원, 보안, Google 생태계 통합
- 적극적인 웹 표준 준수
- 호환성(브라우저 간 일관된 웹 페이지, 다양한 플랫폼 및 기기에서 웹 사이트가 일관되게 동작)
- 개발자 도구(웹개발자 위한 강력한 도구 제공, 웹 애플리케이션 개발에 도움)

### ECMAScript
- ECMA가 정의하는 표준화된 스크립트 프로그래밍 언어 명세
  - 스크립트 언어가 준수해야 하는 규칙, 세부사항 제공
  - ECMAScrpit는 언어라고 보기는 어렵다.
  - JS는 ECMAScript 표준을 구현한 구체적인 프로그래밍 언어
  - ECMAScript는 언어의 핵심을 정의, JavaScript는 ECMAScript 표준을 따라 구현된 언어로 사용됨
  - ECMAScript의 명세를 기반으로 웹 브라우저나 Node.js와 같은 환경에서 실행됨
#### ECMAScript의 역사
- ECMAScript 5(ES6)에서 객체지향 프로그래밍 언어로서 많은 발전을 이룸
- 기존 JavaScript는 브라우저에서만의 웹 페이지의 동적인 기능을 구현하는 데에만 사용되었음
- Node.js 출시로 브라우저 외부에서도 실행 가능, 서버 사이드 개발에도 사용
  - 단순 스크립트 언어를 넘어 프로그래밍 언어로 평가받음
  - 다양한 프레임워크와 라이브러리 개발, 웹 개발 분야에서 필수언어로 자리잡음

# JavaScript
## 변수
- ES6 이후의 명제를 따름
- 권장 스탕리 가이드
  - https://standardjs.com/rules-kokr.html
### 변수 작성 규칙
식별자(변수명) 작성 규칙
- 반드시 문자, 달러('$') 또는 밑줄('_')로 시작
- 대소문자 구분
- 예약어 사용 불가 (for, if, function 등)

#### 식별자(변수명) Naming case
- camelCase
  - 변수, 객체, 함수에 사용
- PascalCase
  - 클래스, 생성자에 사용
- SNAKE_CASE(대문자 스네이크 케이스)
  - 상수(constants)에 사용


### 변수 선언 키워드
1. **let**
2. **const**
3. **var**

### let
- 블록 스코프(block scope)를 갖는 지역변수 선언
- **재할당 가능**
- 재선언 불가능
```javascript
let number = 10   // 1. 선언 및 초기값 할당
number = 20       // 2. 재할당 가능

let number = 10   // 1. 선언 및 초기값 할당
let number = 20   // 2. 재선언 불가능
```

### const
- 블록 스코프(block scope)를 갖는 지역변수 선언
- **재할당, 재선언 불가능**
- **선언 시 반드시 초기값 필요**
```js
const number = 10   // 1. 선언 및 초기값 할당
number = 10         // 2. 재할당 불가능

const number = 10   // 1. 선언 및 초기값 할당
const number = 20

const number        // 선언 시 반드시 초기값 설정 필요
```

**block scope**
- if, for, 함수 등의 중괄호 내부
- 블록스코프 가지는 변수는 블록 밖에서 접근 불가
```js
let x = 1

if (x == 1) {
  let x = 2

  console.log(x)  // 2
}

console.log(x)  // 1
```
### 어떤 변수 선언 키워드를 사용해야 할까 ?
- const를 기본으로 사용
  - 해당 변수가 재할당되지 않을 것임을 명확히 표현
  - 개발자들에게 변수의 용도와 동작을 더 쉽게 이해할 수 있게 해줌
  - 의도치 않은 변수 값 변경으로 인한 버그 예방
  - 큰 규모의 팀 프로젝트나 팀 작업에서 중요
- 필요한 경우(**재할당이 필요한 경우**)에만 let으로 바꾸기
  - let을 사용하는 것은 해당 변수가 의도적으로 변경될 수 있음을 명확히 나타냄
  - 코드의 유연성을 확보하면서도 const의 장점을 최대한 활용할 수 있음

# DOM
## 개요
### 웹브라우저에서의 JavaScript
> 웹 페이지의 동적인 기능 구현

**JavaScript 실행 환경 종류**
1. HTML Script 태그
```html
<body>
  <script>
    console.log('hello')
  </script>
</body>
```
2. js 확장자 파일
```js
// hello.js
console.log('Hello')
```
```html
<body>
  <script src="hello.js"></script>
</body>
```
3. 브라우저 console
- 브라우저 콘솔에서 직접 실행

### DOM(document Object Model)
- 웹페이지(Document)를 구조화된 객체로 제공하여 프로그래밍 언어가 페이지 구조에 접근할 수 있는 방법을 제공
- 문서 구조, 스타일, 내용 등을 변경할 수 있도록 함.

**Document 구조**
- HTML 문서는 상자들이 중첩된 형태로 볼 수 있음
- 각 상자는 객체
- 이 객체와 상호작용하여 어떤 HTML태그를 나타내는지, 어떤 콘텐츠가 포함되어 있는지 알아낼 수 있음
- 이 표현을 DOM이라고 부름

#### DOM tree
- 브라우저는 HTML 문서를 해석하여 DOM tree라는 개체 트리로 구조화
- 객체 간 상속 구조 존재

### document 객체 
- 웹페이지 객체
- DOM Tree의 진입점
- 페이지를 구성하는 모든 객체 포함

## DOM 선택
**DOM 조작 시 기억해야 할 것**
> 웹페이지를 동적으로 만들기 == 웹페이지를 조작하기

**조작순서**
1. 조작하고자 하는 요소 선택(또는 탐색)
2. 선택된 요소의 콘텐츠 또는 속성을 조작

### 선택 메서드
#### document.querySelector()
- 제공한 선택자와 일치하는 요소 한 개 선택
- 제공한 선택자를 만족하는 첫번째 객체 반환(없다면 null)
#### document.querySelectorAll()
- 제공한 선택자와 일치하는 여러 요소 선택
- 제공한 선택자를 만족하는 NodeList 반환

## DOM 조작
1. **속성 조작**
    - **클래스 속성 조작**
    - **일반 속성 조작**
2. **HTML 콘텐츠 조작**
3. **DOM 요소 조작**
4. **스타일 조작**

### 속성 조작
1. **`classList`** : 요소의 클래스 목록을 DOMTokenList(유사배열) 형태로 반환
- `element.classList.add()`
  - 지정한 클래스 값을 추가
- `element.classList.remove()`
  - 지정한 클래스 값을 제거
- `element.classList.toggle()`
  - 클래스가 존재한다면 제거 후 false 반환
  - 존재하지 않으면 클래스 추가 후 true 반환
```html
  <script>
    const h1Tag = document.querySelector('.heading')
    console.log(h1Tag.classList)

    h1Tag.classList.add('red')
    console.log(h1Tag.classList)

    h1Tag.classList.remove('red')
    console.log(h1Tag.classList)

    h1Tag.classList.toggle('red')
    console.log(h1Tag.classList)
  </script>
```

2. **일반 속성 조작 메서드**
- `Element.getAttribute()`
  - 해당 요소에 지정된 값을 반환(조회)
- `Element.setAttribute(name, value)`
  - 지정된 요소의 속성값을 설정
  - 이미 있으면 기존 값 갱신(그렇지 않으면 지정된 이름과 값으로 새 속성이 추가)
- `Element.removeAttribute()`
  - 요소에서 지정된 이름을 가진 속성 제거
```html
  <script>
    const aTag = document.querySelector('a')
    console.log(aTag.getAttribute('href'))

    aTag.setAttribute('href', 'https://www.naver.com/')
    console.log(aTag.getAttribute('href'))

  aTag.removeAttribute('href')
  console.log(aTag.getAttribute('href'))
</script>
```

### HTML 콘텐츠 조작
**`textContent`**:  요소의 텍스트 콘텐츠 표현
```html
  <script>
    // HTML 콘텐츠 조작
    const h1Tag = document.querySelector('.heading')
    console.log(h1Tag.textContent)

    h1Tag.textContent = '내용수정'
    console.log(h1Tag.textContent)
  </script>
```

### DOM 요소 조작
- `document.createElement(tagName)`
  - 작성한 tagName의 HTML 요소 생성 후 반환
- `Node.appendChild()`
  - 한 Node를 특정 부모 Node의 자식 NodeList 중 마지막 자식으로 삽입
  - 추가된 Node 객체 반환
- `Node.removeChild()`
  - DOM에서 자식 Node 제거
  - 제거된 Node 반환
```html
  <script>
    // 생성
    const h1Tag = document.createElement('h1')
    h1Tag.textContent = '제목'
    console.log(h1Tag)    

    // 추가
    const divTag = document.querySelector('div')
    divTag.appendChild(h1Tag)
    console.log(divTag)

    // 삭제
    const pTag = document.querySelector('p')
    divTag.removeChild(pTag)
    
  </script>
```
### style 조작
`style` : 해당 요소의 모든 style 속성 목록을 포함
```html
  <script>
    const pTag = document.querySelector('p')

    console.log(pTag.style)
    pTag.style.color = 'crimson'  // 색상
    pTag.style.fontSize = '3rem'  // 크기
    pTag.style.border = '2px solid black' // 테두리    
  </script>
```
## 참고
#### 1. **DOM 속성 확인 Tip**
- 개발자도구 - Elements - Properties
- 선택한 해당 요소의 모든 DOM 속성 확인 가능
#### 2. **용어 정리**
- Node : DOM의 기본 구성 단위
  - DOM 트리의 각 부분은 Node라는 객체로 표현됨
- NodeList : DOM 메서드를 사용해 선택한 Node의 목록
  - 배열과 유사한 구조를 가짐(JS의 배열 메서드 사용 가능)
  - Index로만 각 항목에 접근 가능
  - `querySelectorAll()`에 의해 반환되는 NodeList는 DOM의 변경사항을 실시간으로 반영 X
    - 이전에 이미 선택한 NodeList값은 변하지 않음
- Element : Node의 하위 유형
  - Element는 DOM 트리에서 HTML 요소를 나타내는 특별한 유형의 Node
  - `<p>`, `<div>`, `<span>`, `<body>` 등의 HTML 태그들이 Element 노드 생성
  - Node의 속성과 메서드를 모두 가지고 있으며, 추가적으로 요소 특화된 기능(className 등)을 가지고 있음
- Parsing : 브라우저가 문자열을 해석하여 DOM tree로 만드는 과정
#### 3. **세미콜론 (semicolon)**
- JS는 문장 마지막 `;`을 선택적으로 사용 가능
- 없으면 ASI에 의해 자동으로 삽입됨
- 최근에는 사용하지 않는 추세
#### 4. **var**
- ES6 이전 변수선언에 사용했던 키워드
- 재할당, 재선언 가능
- 함수 스코프를 가짐
  - 함수가 아니라면 무조건 전역변수
- 호이스팅되는 특성으로 인해 예기치 못한 문제 발생 가능
  - 선언 전 사용 가능
- 변수 선언 시 키워드 사용하지 않으면 자동으로 var로 선언됨
#### 5. **호이스팅(hoisting)**
> 매 우 중 요 (면접 빈출 질문 + 비동기)
- 변수 선언이 끌어올려지는 현상
  - 선언 위치와 상관없이 함수 시작 지점, 전역에서는 코드가 시작될 때 처리됨
  - var로 선언한 변수는 초기화와 선언이 동시에 이루어짐
  - 변수에 무언가를 할당하기 전까지 `undefined`를 가짐
  - 따라서 출력 코드를 먼저, var의 선언+초기화 코드를 이후에 작성한 코드에서 오류가 발생하지 않음
  ```javascript
  console.log(name)
  var name = '홍길동'

  // 위와 동일하게 동작
  var name
  console.log(name)
  var name = '홍길동'
  ```
- let과 const로 선언된 변수도 기술적으로는 호이스팅 되지만
- 변수가 만들어지는 내부 과정이 다르기 때문에 이 문제를 방지할 수 있음
  - TDZ로 인해 초기화 이전에 접근 불가
