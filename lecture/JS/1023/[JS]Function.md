# 함수
**참조 자료형에 속함(Function Object)**
- 참조 자료형 : 가변적
- 객체의 주소가 저장됨
## 함수 정의
**함수 구조**
- function 키워드
- 함수의 이름
- 함수의 매개변수
- 함수의 body를 구성하는 statements
- return 없다면 undefined 반환

### **선언식**
- 호이스팅 됨
- 코드의 구조와 가독성 면에서 표현식보다 낫다
```js
function add (num1, num2) {
  return num1 + num2
}
```

### **표현식**
- 호이스팅 되지 않음
  - 변수 선언만 호이스팅, 함수 할당은 실행 시점에 이루어짐
- 함수 이름 없는 익명함수 사용 `function (num1, num2)`
```js
const sub = function (num1, num2) {
  return num1 - num2
}
```

**표현식과 선언식의 차이**
- 선언식이나 표현식이나 호출할 때는 동일함
- 변수에 할당하느냐 함수 그 자체를 선언하느냐 차이

### 표현식 사용을 권장하는 이유
- 호이스팅 X
  - 코드 실행 흐름 명확하게 예측 가능
- 유연성
  - 변수에 할당되므로 함수를 값으로 다루기 쉬움
- 스코프 관리
  - 블록스코프인 let이나 const와 함께 사용하여 엄격한 스코프 관리 가능
## 매개변수
### 기본 함수 매개변수
**전달하는 인자가 없거나 undefined가 전달될 경우 이름 붙은 매개변수를 기본값으로 초기화**
```js
const greeting = function (name = 'Anonymous') {
  return `Hi ${name}`
}

greeting()  // Hi Anonymous
```
### 나머지 매개변수
**임의의 수의 인자를 '배열'로 허용하여 가변 인자를 나타냄**
- 함수 정의 시 나머지 매개변수는 하나만 작성 가능
- 나머지 매개변수는 함수 정의에서 매개변수 마지막에 위치해야 함
- 파이썬의 *args와 비슷한 기능
  - 파이썬은 튜플, js는 배열

### 매개변수와 인자 개수가 불일치할 때
#### 정의된 매개변수 개수보다 적은 인자가 전달됐을 때
- 누락된 인자는 undefined로 할당(오류발생 X)
```js
const threeArgs = function (param1, param2, param3) {
  return [param1, param2, param3]
}

threeArgs() // [undefined, undefined, undefined]
threeArgs(1)  // [1, undefined, undefined]
threeArgs(2, 3) // [2, 3, undefined]
```
#### 정의된 매개변수 개수보다 많은 인자가 전달됐을 때
- 초과 입력한 인자는 사용하지 않음(오류발생 X)
```js
const noArgs = function () {
  return 0
}
noArgs(1, 2, 3) // 0

const twoArgs = function (param1, param2) {
  return [param1, param2]
}
twoArgs(1, 2, 3)  // [1, 2]
```
## Spread syntax
**`...(전개 구문)`**
- 배열이나 문자열같이 반복 가능한 항목 확장.
- 전개 대상에 따라 역할이 다름
  - 배열이나 객체의 요소를 개별적인 값으로 분리하거나
  - 다른 배열이나 객체의 요소를 현재 배열이나 객체에 추가
  - 등등

### 사용처
1. **함수와의 사용**
  - 함수 호출 시 인자 확장
  ```js
  function myFunc(x, y, z) {
    return x + y + z
  }

  let numbers = [1, 2, 3]
  console.log(myFunc(...numbers)) // 6
  ```
  - 나머지 매개변수(압축)
  ```js
  function myFunc2 (x, y, ...restArgs) {
    return [x, y, restArgs]
  }

  console.log(myFunc2(1, 2, 3, 4, 5)) // [1, 2, [3, 4, 5]]
  console.log(myFunc2(1, 2)) // [1, 2, []]
  ```
2. **객체와의 사용**
3. **배열과의 활용**

## 화살표 함수 표현식
```js
// 일반 표현식
const functionName = function (param1, param2, ... ) {
  return result
}

// 화살표 함수 표현식
const functionName = (param1, param2, ... ) => { return result }
const functionName = (param1, param2, ... ) => result
```
1. function 키워드 제거 후 매개변수와 중괄호 사이에 화살표(=>) 작성
2. 함수의 매개변수가 하나 뿐이라면, 매개변수의 `()` 제거 가능(그러나 생략하지 않는 것을 권장함.)
3. 함수 본문의 표현식이 한 줄이라면, `{}`와 `return` 제거 가능
4. 인자가 없다면 `()` 또는 `_`로 표시 가능
  - `const noArgs1 = () => 'No args'`
  - `const noArgs2 = _ => 'No args'`
5. object를 반환한다면 return을 명시적으로 작성해야 함
  - `const returnObject1 = () => { return { key: 'value'} }`
6. return을 작성하지 않으려면 객체를 소괄호로 감싸야 함
  - `const returnObject1 = () => ({ key: 'value'})`
