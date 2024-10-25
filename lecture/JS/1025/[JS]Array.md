# 배열

> 순서가 있는 데이터 집합을 저장하는 자료구조
> 

**배열구조**

- `[]` 를 이용해 작성
- 요소의 자료형은 제약 없음
- length 속성을 사용해 배열에 담긴 요소 개수 확인 가능

### 배열 메서드

| **메서드** | **역할** |
| --- | --- |
| `push` / `pop`  | 배열 끝 요소를 추가 / 제거 |
| `unshift` / `shift`  | 배열 앞 요소를 추가 / 제거 |

# Array helper method

> 배열 조작을 보다 쉽게 수행할 수 있는 특별한 메서드 모음
> 
- 배열의 각 요소를 순회하며 각 요소에 대해 **콜백함수 호출**
- 대표 메서드
    - `forEach()`, `map()`, `filter()`, `every()`, `some()`, `reduce()` 등
- 메서드 호출 시 인자로 **콜백함수**를 받는 것이 특징

## 콜백 함수

- 다른 함수에 인자로 전달되는 함수
- 외부 함수 내에서 호출되어 일종의 루틴이나 특정 작업을 진행

```jsx
const numbers1 = [1, 2, 3]

// 1)
numbers1.forEach(function (num) {
	console.log(num ** 2)
})

// 2)
const callBackFunc = function (number) {
	console.log(number)
}

numbers1.forEach(callBackFunc)
```

## `forEach()`

```jsx
arr.forEach(function (item[, index[, array]]) {
	// do something
})

// 화살표함수 표기
arr.forEach((item[, index[, array]]) => {
	//do something
})
```

- 배열 내의 모든 요소 각각에 대해 함수(콜백함수)를 호출
- 반환값 없음 (undefined)
- 3가지 매개변수로 구성
    - item: 처리할 배열의 요소
    - index: 처리할 배열 요소의 인덱스(선택인자)
    - array: forEach를 호출한 배열(선택인자)

## `map()`

```jsx
const newArr = arr.map(function (item[, index[, array]]) {
	// do something
})
```

- 배열 내의 모든 요소 각각에 대해 함수(콜백함수)를 호출
- 배열의 각 요소에 대해 실행한 콜백함수 호출 결과를 모은 새로운 배열 반환
- forEach의 매개변수와 동일

### python에서의 map 함수와 비교

- python
    
    ```jsx
    numbers = [1, 2, 3]
    
    def square(num):
    		return num ** 2
    
    new_numbers = list(map(square, numbers)) 
    
    ```
    
    - map에 square 함수를 인자로 넘겨 numbers 배열의 각 요소를  square 함수의 인자로 사용
- JavaScript
    
    ```jsx
    const numbers = [1, 2, 3]
    
    const callBackFunction = function (number) {
    	return number ** 2
    }
    
    const newNumbers = numbers.map(callBackFunction)
    ```
    
    - map 메서드에 callBackFunc 함수를 인자로 넘겨 numbers 배열에 각 요소를 callBackFunc 함수의 인자로 사용

## 배열 순회 종합

- `for loop`
    - 배열의 인덱스를 이용하여 각 요소에 접근
    - break, continue 사용가능
- `for … of`
    - 배열 요소에 바로 접근 가능
    - break, continue 사용 가능
- `forEach`
    - **사용 권장**
    - 간결하고 가독성 높음
    - callback 함수를 이용하여 각 요소를 조작하기 용이함
    - break, continue 사용 불가

### 기타 Array Helper Methods

- `filter` : 콜백 함수의 반환값이 참인 요소들만 모아서 새로운 배열을 반환
- `find` : 콜백 함수 반환값이 참이면 해당 요소 반환
- `some` : 배열의 요소 중 적어도 하나라도 콜백함수를 통과하면 true를 반환하고 즉시 배열 순회 중지. 모두 통과하지 못하면 false 반환
- `every` : 배열의 모든 요소가 콜백함수를 통과하면 true 반환. 하나라도 통과하지 못하면 즉시 false 반환하고 배열 순회 중지

## 배열 with 전개구문

### 배열 복사

```jsx
let parts = ['어깨', '무릎']
let lyrics = ['머리', ...parts, '발']

console.log(lyrics)  // ['머리', '어깨', '무릎', '발]
```

# 참고

## 콜백 함수의 이점

### 함수의 재사용성

- 함수를 호출하는 코드에서 콜백 함수의 동작을 자유롭게 변경할 수 있음
    - map 함수는 콜백 함수를 인자로 받아 배열의 각 요소를 순회하며 콜백 함수를 실행
    - 이 때, 콜백 함수는 각 요소를 변환하는 로직을 담당하므로, map함수를 호출하는 코드는 간결하고 가독성이 높아짐

### 비동기적 처리

- JavaScript는 병렬적인 데이터 처리를 위해 비동기적으로 콜백함수 실행
- 다른 코드의 실행을 방해하지 않음

## forEach에서 break 사용하기

- `forEach`에서는 break 키워드 사용 불가
- 대신 `some`과 `every`의 특징을 활용해 마치 break를 사용하는 것처럼 활용할 수 있음
    - `some` 활용 예시
    
    ```jsx
    const names = ['Alice', 'Bella', 'Cathy']
    
    names.some(function (name) {
    	console.log(name)
    	if (name === 'Bella') {
    		return true
    	}
    	return false
    })
    ```
    
    - `every` 활용 예시
    
    ```jsx
    const names = ['Alice', 'Bella', 'Cathy']
    
    names.every(function (name) {
    	console.log(name)
    	if (name === 'Bella') {
    		return false
    	}
    	return true
    })
    ```
    

## 배열은 객체다

- 배열은 **key(인덱스**)와 **속성(length**)들을 담고 있는 참조 타입의 객체
- 배열의 요소를 대괄호 접근법을 사용해 접근하는 건 객체 문법과 같음
- 숫자형 키를 사용함으로써 배열은 객체 기본 기능 이외에도 **순서가 있는 컬렉션**을 제어하게 해주는 특별한 메서드를 제공