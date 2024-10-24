# 객체

> **키로 구분된 데이터 집합을 저장하는 자료형**\
> **OOP 관점의 객체가 아닌, 데이터 타입의 Object**

## 구조 및 속성

### 객체 구조

- `{}` 이용해 작성
- 중괄호 안에는 `key: value` 쌍으로 구성된 속성(property)을 여러 개 작성 가능
- **key는 문자형만 허용**(단순 변수명으로 작성해도 문자열로 자동 변환)
- value는 모든 자료형 허용

```jsx
const user = {
  name: 'Alice',
  'key with space': true,
  greeting: function() {
    return 'hello'
  }
}
```

### 속성 참조

- `.` 또는 `[]`로 객체 요소 접근
- `key` 이름에 띄어쓰기 같은 구분자가 있으면 대괄호 접근만 가능

```jsx
// 조회
console.log(user.name)  // Alice
console.log(user['key with space']) // true

// 추가
user.address = 'korea'
console.log(user) // {name: 'Alice', key with space: true, address: 'korea', greeting: f}

// 수정
user.name = 'Bella'
console.log(user.name)  // Bella

// 삭제
delete user.name
console.log(user) // {key with space: true, address: 'korea', greeting: f}
```

### in 연산자

**속성이 객체에 존재하는지 여부 확인**

```jsx
console.log('greeting' in user) // true (greeting이라는 속성(key)가 존재)
console.log('korea' in user)  // false (korea라는 속성(key)가 존재X)
```

## 메서드

- `object.method()` 방식으로 호출
- 메서드는 객체를 '행동'할 수 있게 함
- `this` 키워드를 사용해 객체에 대한 특정한 작업을 수행할 수 있음

```jsx
console.log(user.greeting())
```

## this

> **함수나 메서드를 호출한 객체를 가리키는 키워드**\
> **함수 내에서 객체의 속성 및 메서드에 접근하기 위해 사용**

```jsx
const person = {
  name: 'Alice',
  greeting: function () {
    return `Hello my name is ${this.name}`
  },
}

console.log(person.greeting())  // Hello my name is Alice
```

**JavaScript에서 `this`는 함수를 호출하는 방법에 따라 가리키는 대상이 다름**

- 단순 호출
    - 전역객체 (최상위 객체: window)
- 메서드 호출
    - 메서드를 호출한 객체

```jsx
const myFunc = function () {
  return this
}

const myObj = {
  data: 1,
  myFunc: function () {
    return this
  }
}

console.log(myFunc()) // window
console.log(myObj.myFunc()) // myObj
```

### 중첩된 함수에서의 `this` 문제점과 해결책

```jsx
const myObj = {
  numbers: [1, 2, 3],
  myFunc1: function () {
    this.numbers.forEach(function (number) {
      console.log(this) // window
    })
  },
  myFunc2: function () {
    this.numbers.forEach((number) => {
      console.log(this)
    })
  }
}

console.log(myObj.myFunc1())
console.log(myObj.myFunc2())
```

> `forEach`의 인자로 작성된 함수는 일반적인 함수 호출이기 때문에 `this`가 전역 객체를 가리킴 
→ 화살표 함수로 해결
> 
- 화살표 함수는 자신만의 `this`를 가지지 않기 떄문에 외부 함수(`myFunc`)에서의 `this` 값을 가져옴
- JS의 함수는 호출될 때 this를 암묵적으로 전달받음
- JS의 this는 함수가 호출되는 방식에 따라 결정되는 현재 객체를 나타냄
- JS의 this는 함수가 호출되기 전까지 값이 할당되지 않고 호출 시에 결정됨(**동적할당**)

**장점**

- 함수를 하나만 만들어 여러 객체에서 재사용할 수 있다

**단점**

- 유연함이 실수로 이어질 수 있음
- 개발자는 this의 동작 방식을 충분히 이해하고 장점을 취하면서 실수를 피하는 데에 집중

## 추가 객체 문법

### 1. 단축 속성

- 키 이름과 값으로 쓰이는 변수의 이름이 같은 경우 단축 구문 사용 가능

```jsx
const name = 'Alice'
const age = 30

const user = {
  name, // name: 'Alice'
  age,  // age: 30
}
```

### 2. 단축 메서드

- 메서드 선언 시 `function` 키워드 생략 가능

```jsx
const myObj1 = {
  myFunc() {
    return 'Hello'
  }
}
```

- 하지만 그냥 화살표 함수 쓰세요

```jsx
const myObj = {
  myFunc: () => {'Hello'},
}
```

### 3. 계산된 속성

- 키가 `[]`로 둘러싸여 있는 속성
- 고정된 값이 아닌 변수 값을 사용할 수 있음

```jsx
const product = prompt('물건 이름을 입력해주세요')
const prefix = 'my'
const suffix = 'property'

const bag = {
  [product]: 5,
  [prefix + suffix]: 'value',
}

console.log(bag)  // {연필: 5, myproperty: 'value'}
```

### 4. 구조 분해 할당

- 배열 또는 객체를 분해하여 객체 속성을 변수에 쉽게 할당할 수 있는 문법
- 분해했을 때 일치하는 변수명이 존재해야 함

```jsx
const person = {
	name: 'Bob',
	age: 35,
	city: 'London',
}

const {firstName, userId, email } = userInfo

// Alice alice123 alice123@gmail.com
console.log(firstName, userId, email)
```

**함수의 매개변수에 구조 분해 할당 적용하기**

```jsx
const person = {
	name: 'Bob',
	age: 35,
	city: 'London',
}

function printInfo({ name, age, city }) {
	console.log(`이름: ${name}, 나이: ${age], 도시: ${city}`)
}

printInfo(person)  // 이름: Bob, 나이: 35, 도시: London
```

### 5. Object with 전개구문

- 객체 복사(객체 내부에서 객체 전개)
- 얕은 복사에 활용 가능

```jsx
const obj = {b: 2, c: 3, d: 4}
const newObj = {a: 1, ...obj, e: 5}

console.log(newObj)
```

### 6. 유용한 객체 메서드

- `Object.keys()` : Object의 key값들 배열에 담아 반환
- `Object.values()` : Object의 value값들 배열에 담아 반환

```jsx
const profile = {
  name: 'Alice',
  age: 30,
}

console.log(Object.keys(profile))  // ['name', 'age']
console.log(Object.values(profile))  // ['Alice', 30]
```

### 7. Optional chaining(`?.`)

- 속성이 없는 중첩 객체에 에러 없이 접근하는 방법
- 참조 대상이 null 또는 undefined라면 에러가 발생하는 대신 평가를 멈추고 undefined 반환

```jsx
const user = {
	name: 'Alice',
	greeting: function () {
		return 'hello'
	}
}

// user에 address 속성이 없으므로 오류 발생해야 함
console.log(user.address.street)  // Uncaught TypeError
console.log(user.address?.street)  // undefined (에러 발생 X)
```

**장점**

- 참조가 누락될 가능성이 있는 경우, 연결된 속성으로 접근할 때 더 짧고 간단한 표현식을 작성할 수 있음
- 어떤 속성이 필요한 지에 대한 보증이 확실하지 않는 경우에 객체의 내용을 보다 편리하게 탐색할 수 있음

**주의 사항**

- 남발하지 말 것
    - 만약 잘못된 데이터가 입력되고 있을 때, optional chaining으로 피하고 있다면 문제가 커질 수 있다!!!
    - 존재하지 않아도 괜찮은 대상에만 사용
    
    ```jsx
    // user 객체는 논리상 반드시 있어야 하지만 address는 필수 값이 아님
    // user에 값을 할당하지 않은 문제가 있을 때 바로 알아낼 수 있어야 하기 때문
    
    // Bad
    user?.address?.street
    
    // Good
    user.address?.street
    ```
    
- Optional chaining 앞의 변수는 반드시 선언되어 있어야 함

```jsx
console.log(myObj?.address) // Uncaught ReferenceError: myObj is not defined
```

**정리**

1. `obj?.prop` : obj가 존재하면 obj.prop을 반환, 그렇지 않으면 undefined 반환
2. `obj?.[prop]` : obj가 존재하면 obj[prop] 반환, 그렇지 않으면 undefined 반환
3. `obj?.method()` : obj가 존재하면 obj.method() 호출, 그렇지 않으면 undefined 반환

## JSON

- JavaScript Object  Notation
- key-value 형태로 이루어진 자료 표기법
- JSON은 형식이 있는 ‘문자열’
- JavaScript에서 JSON을 사용하기 위해서는 Object 자료형으로 변환해야 함

**Object ↔ JSON 변환하기**

- `JSON.stringify(object)` : Object 자료형을 문자열로 변환(Object → JSON)
- `JSON.parse(json)` : JSON을 Object 자료형으로 변환

```jsx
const jsObject = {
	coffee: 'Americano',
	iceCream: 'Cookie and cream',
}

// Object -> JSON
const objToJson = JSON.stringify(jsObject)
console.log(objToJson)  // {"coffee":"Americano","iceCream":"Cookie and cream"}
console.log(typeof objToJson)  // string

// JSON -> Object
const jsonToObj = JSON.parse(objToJson)
console.log(jsonToObj)  // { coffee: 'Americano', iceCream: 'Cookie and cream'}
console.log(typeof jsonToObj)  //  object
```

## 클래스

- JS에서 기존 방법으로 객체 생성?
    - Object 자료형 선언
- 동일 형태의 다른 객체를 만든다면?
    - 또 다른 객체 선언하여 생성해야 함

### 클래스 기본 문법

1. class 키워드
2. 클래스 이름
3. 생성자 메서드

```jsx
class MyClass {
	// 여러 메서드 정의할 수 있음
	constructor() { ... }
	method1() { ... }
	method2() { ... }
	...
} 
```

**활용 예시**

```jsx
class Member {
	constructor(name, age) {
		this.name = name
		this.age = age
	}
	sayHi() {
		console.log(`Hi, I am ${this.name}.`)
	}
}

const member = new Member('Alice', 20)

console.log(member)  // Member { name: 'Alice', age: 20 }
console.log(member.name)  // Alice
member.sayHi()  // Hi, I am Alice.
```

### new 연산자

```jsx
const instance = new ClassName(arg1, arg2)
```

- 클래스나 생성자 함수를 사용하여 새로운 객체 생성
- 클래스의 `constructor()` 는 new 연산자에 의해 자동으로 호출됨
- 특별한 절차 없이 객체를 초기화 할 수 있음
- new 없이 클래스를 호출하면 TypeError 발생