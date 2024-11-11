# Vue Router

날짜: 2024년 11월 11일
태그: Vue

# Routing

- 네트워크에서 경로를 선택하는 프로세스
- 웹 애플리케이션에서 다른 페이지 간의 전환과 경로를 관리하는 기술

**SSR에서의 Routing**

- SSR에서 routing은 서버 측에서 수행
- 서버가 사용자가 방문한 URL 경로를 기반으로 응답을 전송
- 링크를 클릭하면 브라우저는 서버로부터 HTML 응답을 수신하고 새 HTML로 전체 페이지를 다시 로드

**CSR에서의 Routing**

- 클라이언트 측에서 수행
- 클라이언트 측 JavaScript가 새 데이터를 동적으로 가져와 전체 페이지를 다시 로드하지 않음

**SPA에서 Routing이 없다면**

- 유저가 URL을 통한 페이지의 변화를 감지할 수 없음
- 페이지가 무엇을 렌더링 중인지에 대한 상태를 알 수 없음
    - URL이 1개이기 때문에 새로고침 시 처음 페이지로
    - 링크 공유 시 첫 페이지만 공유 가능
- 브라우저의 뒤로 가기 기능을 사용할 수 없음
    
    → 페이지는 1개이지만, 주소에 따라 여러 컴포넌트를 새로 렌더링하여 마치 여러 페이지를 사용하는 것처럼 보이도록 해야 함. 
    

# Vue Router

**사전 준비**

- Vite로 프로젝트 생성 시 Router 추가

![image.png](image.png)

## **Vue 프로젝트 구조 변화**

1. App.vue 코드 변화
    
    ```html
    <!-- App.vue -->
    
    <template>
    	<header>
    		<nav>
    			<RouterLink to="/">Home</RouterLink>
    			<RouterLink to="/about/">About</RouterLink>
    		</nav>
    	</header>
    	
    	<RouterView />
    </template>
    ```
    
2. router 폴더 신규 생성
    - `router/index.js`
        - 라우팅에 관련된 정보 및 설정이 작성 되는 곳
        - router에 URL과 컴포넌트를 매핑
3. views 폴더 신규 생성
    - RouterView 위치에 렌더링 할 컴포넌트를 배치
    - 기존 components 폴더와 기능적으로 다른 것은 없음
    - 단순 분류의 의미로 구성
        - 일반 컴포넌트와 구분하기 위해 컴포넌트 이름을 View로 끝나도록 작성 권장

### RouterLink

- 페이지를 다시 로드하지 않고 URL을 변경하여 URL 생성 및 관련 로직을 처리
- HTML의 <a> 태그를 렌더링

### RouterView

- RouterLink URL에 해당하는 컴포넌트를 표시
- 원하는 곳에 배치하여 컴포넌트를 레이아웃에 표시할 수 있음
    
    ![image.png](image%201.png)
    

## Basic Routing

1. index.js에 라우터 관련 설정 작성(주소, 이름, 컴포넌트)
    
    `index.js`
    
    ```jsx
    const router = createRouter({
    	routes: [
    		{
    			path: '/',
    			name: 'home',
    			component: HomeView
    		},
    		...
    	]
    })
    ```
    
2. RouterLink의 ‘to’ 속성으로 index.js에서 정의한 주소값(path) 사용
    
    `App.vue`
    
    ```jsx
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/about/">About</RouterLink>
    ```
    
3. RouterLink 클릭 시 경로와 일치하는 컴포넌트가 RouterView에서 렌더링 됨
    
    `App.vue`
    
    ```jsx
    <RouterView />
    ```
    

## Named Routes

경로에 이름을 지정하는 라우팅

### 예시

- name 속성 값에 경로에 대한 이름을 지정
- 경로에 연결하려면 RouterLink에 `v-bind`를 사용해 ‘to’ props 객체로 전달
    
    `index.js`
    
    ```jsx
    const router = createRouter({
    	routes: [
    		{
    			path: '/',
    			name: 'home',
    			component: HomeView
    		},
    		...
    	]
    })
    ```
    
    `App.vue`
    
    ```jsx
    <RouterLink to="{ name: 'home' }">Home</RouterLink>
    <RouterLink to="{ name: 'about' }">About</RouterLink>
    ```
    

### 장점

- 하드 코딩 된 URL 사용하지 않아도 됨
- URL 입력 시 오타 방지

## Dynamic Route Matching

- 주어진 패턴 경로를 동일한 컴포넌트에 매핑해야 하는 경우에 활용
- 모든 사용자의 ID를 활용하여 프로필 페이지 URL을 설계한다면?
    - user/1
    - user/2
    - …
    - 일정한 패턴의 URL 작성 반복

### 매개변수를 사용한 동적 경로 매칭 활용

`UserView.vue`

```jsx
<template>
	<div>
		<h1>UserView</h1>
	</div>
</template>
```

- views 폴더 내 UserView 컴포넌트 작성

`index.js`

```jsx
import UserView from '../views/UserView.vue'

const router = createRouter({
		routes: [
			{
				path: '/user/:id',
				name: 'user',
				component: UserView
			},
		]
	})
```

- 매개변수는 `:`으로 표기
- UserView 컴포넌트 라우트 등록

`App.vue`

```jsx
import { ref } from 'vue'

const userId = ref(1)

<RouterLink :to="{ name: 'user', params: {'id': userId } }">User</RouterLink>
```

- 매개변수는 객체의 params 속성의 객체 타입으로 전달
- 단, 객체의 key 이름과 index.js에서 지정한 매개변수 이름이 같아야 함
    
    → UserView 컴포넌트로 이동하기 위한 RouterLink 작성
    

`UserView.vue`

```html
<template>
	<div>
		<h1>UserView</h1>
		<!-- $route.params로 참조하기 보단 useRoute()로 스크립트 내에서 반응형 변수에 할당 후 참조하는 것을 권장함. -->
		<!-- 
		<h2>{{ $route.params.id }}번 User 페이지>/h2> 
		-->
		<h2>{{ userId }}번 User 페이지</h2>
	</div>
</template>

<script scoped>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const userId = ref(route.params.id)
</script>
```

- 경로가 일치하면 라우트의 매개변수는 컴포넌트에서 `$route.params`로 참조 가능
    
    → 현재 사용자의 id를 출력하기
    
- `useRoute()` 함수를 사용해 스크립트 내에서 반응형 변수에 할당 후 템플릿에 출력하는 것을 권장
- 템플릿에서 `$route` 사용하는 것과 동일

## Nested Routes

### children 옵션

children 옵션 배열 사용

배열 내부에 중첩시킬 routerview 내부에 렌더

중첩된 라우팅

![image.png](image%202.png)

- 애플리케이션의 UI는 여러 레벨 깊이로 중첩된 컴포넌트로 구성되기도 함
- 이 때 URL을 중첩된 컴포넌트의 구조에 따라 변경되도록 이 관계를 표현할 수 있음

- UserProfile, UserPosts 컴포넌트 생성
    
    `UserProfile.vue`
    
    ```html
    <template>
      <div>
        <h1>User Profile</h1>
      </div>
    </template>
    ```
    
    `UserPosts.vue`
    
    ```html
    <template>
      <div>
        <h1>User Posts</h1>
      </div>
    </template>
    ```
    

- index.js에 두 컴포넌트를 import
- children 옵션 사용해 중첩된 라우터에 컴포넌트를 등록

`index.js` 

```jsx
import UserProfile from '@/components/UserProfile.vue'
import UserPosts from '@/components/UserPosts.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...
    {
      path: '/user/:id',
      name: 'user',
      component: UserView,
      children: [
	      { path: 'profile', name: 'user-profile', component: UserProfile },
		    { path: 'posts', name: 'user-posts', component: UserPosts }, 
      ]
    }
  ]
})

```

- 두 컴포넌트에 대한 RouterLink 및 RouterView 작성

`UserView.vue`

```html

<template>
  <div>
    <RouterLink :to="{ name: 'user-profile' }">Profile</RouterLink>
    <RouterLink :to="{ name: 'user-posts' }">Posts</RouterLink>
    <h1>UserView</h1>
    <h2>{{ userId }}번 User 페이지</h2>
    <hr>
    <RouterView />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const userId = ref(route.params.id)
</script>

<style scoped>
</style>

```

**[참고]**

- 중첩된 Named Routes를 다룰 때는 일반적으로 하위 경로에만 이름 지정
    
    ```jsx
    {
      path: '/user/:id',
      // name: 'user',
      component: UserView,
      children: [
        { path: '', name: 'user', component: UserHome },
        { path: 'profile', name: 'user-profile', component: UserProfile },
        { path: 'posts', name: 'user-posts', component: UserPosts }, 
      ]
    }
    ```
    
    - 컴포넌트 간 부모-자식 관계 관점이 아닌 URL에서의 중첩 관계의 관점으로 생각하기

## Programmatic Navigation

RouterLink 대신 JavaScript를 사용해 페이지를 이동하는 것

- 프로그래밍으로 URL 이동하기
- router의 인스턴스 메서드를 사용해 RouterLink로 <a>태그를 만드는 것처럼 프로그래밍으로 네비게이션 관련 작업을 수행할 수 있음

### `router.push()`

- **다른 URL로 이동하는 메서드**
- 새 항목을 history stack에 push함
- 사용자가 뒤로가기 버튼을 클릭하면 이전 URL로 이동 가능
- RouterLink를 클릭했을 때 내부적으로 호출되는 메서드
    - 따라서 `RouterLink 클릭 == router.push() 호출`
    - RouterLink: 선언적 표현 / router.push(): 프로그래밍적 표현

**활용 예시**

- UserView 컴포넌트에서 homeView 컴포넌트로 이동하는 버튼 만들기

`UserView.vue`

```jsx
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()

const goHome = function() {
	router.push({ name: 'home' })
}
...

<button @click="goHome">홈으로!</button>
```

**[참고] `router.push`의 인자 활용**

- [https://router.vuejs.org/guide/essentials/navigation.html](https://router.vuejs.org/guide/essentials/navigation.html)

```jsx
router.push('/users/alice')

router.push({ path: 'users/alice' })

router.push({ name: 'user', params: {username: 'alice' } })

router.push({ path: '/register', query: { plan: 'private' } })

```

### `router.replace()`

- **현재 위치 바꾸기**
- push와 달리 history stack에 새로운 항목을 push 하지 않고 다른 URL로 이동
- 즉, 이동 전 URL로 뒤로 가기 불가

**활용 예시**

- UserView 컴포넌트에서 HomeView 컴포넌트로 이동하는 버튼 만들기

`UserView`

```jsx
const goHome = function () {
	router.replace({ name: 'home' })
}
```

**활용 예시**

- UserView 컴포넌트에서 HomeView 컴포넌트로 이동하는 버튼 만들기

`UserView.vue`

```jsx
const goHome = function() {
	router.replace({ name: 'home' })
}
```

# Navigation Guard

Vue router 통해 특정 URL에 접근할 때 다른 URL로 redirect하거나 취소하여 내비게이션 보호

→ route 전환 전/후 자동으로 실행되는 Hook

**종류**

1. Globally (전역 가드)
    - 애플리케이션 전역에서 모든 라우트 전환에 적용
2. Per-route (라우터 가드)
    - 특정 라우트에만 적용
3. In-component (컴포넌트 가드)
    - 컴포넌트 내에서만 적용

모든 가드는 2개의 인자를 받음

- to: 이동할 URL 정보가 담긴 Route 객체
- from: 현재 URL 정보가 담긴 Route 객체

## Globally Guard

애플리케이션 **전역에서 동작**하는 가드

**작성 위치: `index.js`**

### `router.beforeEach()`

다른 URL로 이동하기 직전에 실행

```jsx
router.beforeEach((to, from) => {
	...
	return false 또는 return {name: 'About'}
})
```

⇒ 선택적으로 다음 값 중 하나를 반환

1. false
    - 현재 내비게이션 취소
    - 브라우저 URL이 변경된 경우 ‘from’ 경로의 URL로 재설정
2. Route Location
    - `router.push()`를 호출하는 것처럼 경로 위치 전달하여 다른 위치로 redirect
    - return 없다면 자동으로 to 경로로 이동

**활용 예시**

- Login 되어있지 않다면 페이지 진입을 막고 Login 페이지로 이동시키기
- LoginView 컴포넌트 작성 및 라우트 등록
    
    `LoginView.vue`
    
    ```jsx
    <template>
    	<div>
    		<h1>LoginView</h1>
    	</div>
    </template>
    ```
    
- 만약 로그인이 되어있지 않고(1), 이동하는 주소 이름이 login이 아니라면(2) login 페이지로 redirect
    
    `index.js` 
    
    ```jsx
    import LoginView from '@/views/LoginView.vue'
    
    {
    	path: '/login',
    	name: 'login',
    	component: LoginView
    }
    
    router.beforeEach((to, from) => {
    	const isAuthenticated = false
    	
    	if (!isAuthenticated && to.name != 'login') {
    		console.log('로그인이 필요합니다')
    		return { name: 'login' }
    	}
    })
    ```
    
    `App.vue`
    
    ```jsx
    <RouterLink :to="{ name: 'login' }"></RouterLink>
    ```
    

## Per-route Guard

**특정 라우터**에서만 동작

**작성 위치: `index.js`의 `각 routes`**

### `beforeEnter()`

- 특정 route에 진입했을 때만 실행
- 단순히 URL의 매개변수나 쿼리 값이 변경될 때는 실행되지 않고, 다른 URL에서 탐색해 올 때만 실행
- routes 객체에서 beforeEnter 정의
    - to에는 이동할 URL, from에는 현재 URL에 대한 정보가 들어있음

```jsx
{
	path: ...,
	component: ...,
	beforeEnter: (to, from) => {
		...
	}
},
```

**활용 예시**

- Login 되어있다면 LoginView 진입을 막고 HomeView 페이지로 이동시키기
    - 전역 가드 `beforeEach` 관련 코드는 주석 처리
- 만약 로그인이 되어있지 않고(1), 이동하는 주소 이름이 login이 아니라면(2) login 페이지로 redirect

`LoginView.vue`

```jsx
const isAuthenticated = true

const router = createRouter({
	routes: [
		{
			path: '/login',
			name: 'login',
			component: LoginView
			beforeEnter: (to, from) => {
				if (isAuthenticated === true) {
					console.log('이미 로그인 상태입니다.')
					return { name: 'home' }
				}
			}
		}
	]
})
```

## In-component Guard

특정 컴포넌트 내에서만 동작

**작성위치: 각 컴포넌트의 `<script>`**

### `onBeforeRouteLeave()`

- 현재 라우트에서 다른 라우트로 이동하기 전에 실행
- 사용자가 현재 페이지를 떠나는 동작에 대한 로직 처

**활용 예시**

- 사용자가 UserView 떠날 시 팝업창 출력

`UserView.vue`

```jsx
import { onBeforeRouteLeave } from 'vue-router'

onBeforeRouteLeave((to, from) => {
	const answer = window.confirm('정말 떠나실 건가요?')
	if (answer === false) {
		return false
	}
})
```

### `onBeforeRouteUpdate()`

- 이미 렌더링 된 컴포넌트가 같은 라우트 내에서 업데이트 되기 전에 실행
- 라우트 업데이트 시 추가 로직 처리

**활용 예시**

- UserView 페이지에서 다른 id를 가진 User의 UserView 페이지로 이동하기
    - 같은 라우트 내에서 업데이트 되는 경우 `/user/1` → `/user/100`
- 만약 `userId` 변경하지 않으면 갱신되지 않음
- 컴포넌트가 재사용 되었기 때문

`UserView.vue`

```jsx
<button @click="routeUpdate">100번 유저 페이</button>

...
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router'

const routeUpdate = function() {
	router.push({ name: 'user', params: { id: 100 } })
}

onBeforeRouteUpdate((to, from) => {
	userId.value = to.params.id
})
```

# 참고

### Lazy Loading Routes

```jsx
// index.js

{
	path: '/about',
	name: 'about',
	component: () => import('../views/AboutView.vue')
},
```

- Vue 애플리케이션 첫 빌드 시 해당 컴포넌트를 로드하지 않고 **해당 경로를 처음 방문할 때 컴포넌트를 로드**하는 것
- 앱을 빌드할 때 처음부터 모든 컴포넌트 로드하면 컴포넌트 크기에 따라 페이지 로드 시간이 길어질 수 있기 때문