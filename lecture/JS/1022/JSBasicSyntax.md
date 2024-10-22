# 기초 문법

## 데이터 타입
**원시 자료형**
- Number, String, Boolean, null, undefined
- 변수에 값이 직접 저장되는 자료형(불변, 값이 복사)
- 변수에 할당될 때 값이 복사됨(copy of value)
- 할당될 때마다 새로운 메모리 주소 할당
- 변수 간 서로 영향을 미치지 않음

**참조 자료형**
- Objects(Object, Array, Function)
- 객체의 주소가 저장되는 자료형(가변, 주소가 복사)
- 객체를 생성하면 객체의 메모리 주소를 변수에 할당
- copy of reference
- 변수 간 서로 영향을 미침

## 원시 자료형
### Number
- 정수 또는 실수형 숫자
### String
- 텍스트 데이터
- `+` 연산자 이용해 문자열끼리 결합 가능
- 나머지 사칙연산은 불가능
#### Template literals
- 내장된 표현식을 허용하는 문자열 작성 방식
- Backtick(``)을 이용하며, 여러 줄에 걸쳐 문자열을 정의할 수도 있고 JS 변수를 문자열 안에 바로 연결할 수도 있음
- 표현식은 `$`와 중괄호(`{expression}`)로 표기
- ES6+ 부터 지원
```js
const age = 100
const message = `홍길동은 ${age}세입니다.`
console.log(message)  // 홍길동은 100세입니다.
```
### null
- 프로그래머가 의도적으로 '값이 없음'을 나타낼 때 사용
```js
let a = null
console.log(a)  // null
```

### undefined
- 시스템이나 JS 엔진이 '값이 할당되지 않음'을 나타낼 때 사용
```js
let b
console.log(b)  // undefined
```

### Boolean
- 조건문 또는 반복문에서 bool 이외의 데이터 타입은 묵시적 형변환에 의해 true / false로 변환됨

| 데이터 타입 | false | true |
|:-----------:|:-----:|:----:|
| undefined | 항상 false | X |
|    null   | 항상 false | X |
| Number | 0, -0, NaN | 그 외 전부 |
| String | ''(빈 문자열) | 그 외 전부 |


### 참조 자료형

## 연산자
- 할당 연산자
- 단축 연산자
- 증감 연산자
  - +=, -= 와 같이 더 명시적인 표현으로 작성하는 것을 권장
- 비교 연산자
  - (결과 Boolean으로 반환)
- 동등 연산자
  - `==`
  - 암묵적 형변환 주의
- 일치 연산자
  - `===`
  - 웬만하면 동등 연산자 말고 일치 연산자를 쓰자.
- 논리 연산자
  - 단축 평가 지원
  - 개발 시 고려할 것

## 조건문
**if**
```javascript
const name = 'customer'

if (name === 'admin') {
  console.log('')
} else if (name === 'customer') {
  console.log('고객님 환영해요')
} else {
  console.log('반갑습니다. ${name} 님')
}
```
### 삼항 연산자
`condition ? expression1 : expression2`
- condition
  - 평가할 조건 (true / false)
- expression1
  - true일 경우 반환값
- expression2
  - false일 경우 반환값

간단한 조건부 로직을 간결하게 표현할 때 유용
- 가독성이 떨어질 수 있으므로 적절한 상황에서만 사용할 것
```js
const age = 20
const message = (age > 18) ? '성인' : '미성년자'
console.log(message)  // '성인'
```
## 반복문
- while
- for
- **for ... in**
- **for ... of**
### for ... in
**객체의 열거 가능한 속성(property)에 대해 반복**
- 여기서 객체는 key-value 형태로 구성된 JS의 Object 타입
```js
for (variable in object) {
  statement
}
```
```js
const object = { a: 'apple', b: 'banana' }

for (const property in object) {
  console.log(property) // property : a, b
  console.log(object[property]) // apple, banana
}
```

### for ... of
**반복 가능한 객체(배열, 문자열 등)에 대해 반복**
- 여기서 객체는 OOP의 객체
```js
for (variable of iterable) {
  statement
}
``` 
```js
const numbers = [0, 1, 2, 3]

for (const numbers of numbers) {
  console.log(number) // 0 1 2 3
}
```
#### for...in과 for...of 비교
- Object 타입에서 for...of 문법을 사용하면 ?
- 객체 관점에서 배열의 인덱스는 정수 이름을 가진 열거 가능한 속성
- for...in 내부적으로 배열의 반복자가 아닌 속성 열거 사용
- 특정 순서에 따라 인덱스 반환하는 것을 보장할 수 없음
- **for...in**은 인덱스의 순서가 중요한 **배열에서는 사용X**
  - **배열에서는 for문, for...of 사용**
- 객체 관점에서 배열의 인덱스는 정수 이름을 가진 속성임
  - 따라서 for...in 문 사용 시 배열의 인덱스가 출력됨(순서는 보장 X)

#### 반복문에서 증감자 선언 어떻게 해야하나 ?
- for 문
  - 일반 for문의 경우 최초 정의한 i를 재할당하면서 사용
  - 따라서 const 사용하면 에러 발생
  - let으로 선언해야 한다.
- for...in, for...of
  - 매 반복마다 새로운 코드블록이 실행됨
  - 즉, 재할당이 아니라 매 반복마다 다른 속성 이름이 변수에 지정됨
  - 따라서 const를 사용해도 에러가 발생하지 않음
    - 단, const 사용 시 블록 내부에서 변수를 수정할 수 없음
## 참고
### NaN을 반환하는 경우
1. 숫자로서 읽을 수 없음 (Number(undefined))
2. 결과가 허수인 수학 계산식 (Math.sqrt(-1))
3. 피연산자가 NaN (7 ** NaN)
4. 정의할 수 없는 계산식 (0 * Infinity)
5. 문자열을 포함하면서 덧셈이 아닌 계산식 ('가' / 3) 

### null & undefined
**'값이 없음'에 대한 표현이 null과 undefined 2가지인 이유**
1. 역사적 맥락
2. null 타입이 "object"인 이유
3. ECMAScript의 표준화