# 프론트엔드 배포 실습

날짜: 2024년 12월 27일

## NoSQL

- 관계형 데이터 베이스
    - MySQL
    - SQLite
- NoSQL
    - Redis
    - MongoDB
    - RabbitMQ
    - 등등..
<br>

직접적으로 프론트와 연결해서 사용하는  NoSQL도 꽤 존재한다.

<br>

### NoSQL이란?

- Not Only SQL
    - 전통적인 RDBMS와는 다른 방식으로 데이터를 저장하고 관리하는 비관계형 데이터베이스
- 대규모의 분산된 데이터 저장과 처리를 효율적으로 수행할 수 있도록 설계
    - 대규모 커뮤니티, SNS 등 수많은 게시글과 댓글이 쏟아지는 사이트들이 효과적으로 다룰 수 있도록 NoSQL 기반으로 사용할 수 있다.
- 유연한 스키마(schema-less), 수평적 확장성, 높은 성능
    - 필요에 따라 스키마를 변경가능
    - 데이터가 늘어나도 여러개의 데이터 서버를 따로 두어서 분산 저장할 수 있어 쉽게 확장 가능
    - 특정 패턴에 최적화
    - 읽기와 쓰기 성능 자체가 좋다.
- 실시간 데이터 관리, 클라우드 보안, 고가용성 애플리케이션에 사용

<br>

**NoSQL의 장점**

- 유연성
    - 데이터 중복 발생 가능
    - 효율적으로 적재할 수 없다보니 저장 공간 낭비될 수 있음
- 확장성
    - 고가의 강력한 서버를 추가하는 대신 분산형 하드웨어 클러스터를 이용해 확장하도록 설계
    - 쉽게 말해 일반 컴퓨터 여러개로 큰 시스템 만들 수 잇다
    - 데이터 처리에 대한 일관성이 떨어질 수 있음
- 고성능
    - 특정 데이터 모델 및 액세스 패턴에 최적화
    - 동일 작업 내 RDBMS 대비 고성능
    - 특정된 접근 패턴에 최적화
    - 여러가지 DB 정규화되어있는 DB에 복잡한 쿼리문을 작성할 수록 RDBMS가 더 좋은 성능을 보일 수 있음
- 고기능성
    - 데이터모델에 맞춰 특벼맇
    - MongoDB와 같은 경우 json 형태의 문서를 저장하고 조회할 수 있는 API 기능 제공
    - Redis는 캐싱이라는 임베디드 메모리를 이용한 데이터 처리 기능 제공 → 빠른 응답속도

<br>

### NoSQL vs RDBMS
**각각의 방식이 특정 용도에 따라 최적화되어있음**
- document
    - 계층 데이터 저장 방식(MongoDB)
- Key-value
    - 키-값쌍을 저장(Redis)
- Column-Family
    - 행과 열로 구성(cassandra)
- GraphDB
    - 노드와 엣지로 구성(Tinkerpop, Neo4J)
- RDBMS
  - id와 column1, column2... 의 테테이블 구조
  - 스키마에 따라 데이터를 저장해야 함

<br>

### 사용사례

- 실시간 데이터 관리
    - 실시간 추천, 개인화 및 개선된 사욪아 경험을 제공
    - 실시간 채팅, 게임에 대한 실시간 점수나 랭킹 등
- 클라우드 보안
    - 그래프 데이터베이스를 사용하면 RDBMS의 join 연산보다 효율적으로 복잡한 관계를 신속하게 추적 → 위험성 초기 발견
    - 비정상적 패턴 빠르게 탐색 가능
- 고가용성 애플리케이션
    - 분산 NoSQL DB의 경우 메시징, 소셜미디어, 파일 공유 등 지연 시간이 짧은 고가용성 애플리케이션을 구축하는 데 용이

```
X(트위터): 카산드라(column-family)로 매일 테라바이트 용량의 트윗 데이터 처리

페이스북(메타): 방대한 사용자 데이터나 소셜 그래프 관리. 추가적으로 HBase 사용(메시징 서비스에 주로 사용)

넷플릭스: 사용자 프로필, 시청기록 등 카산드라 사용, 동영상 소스 배포 처리할 때 많이 사용, SimpleDB도 사용, HBase나 하둡 등 추가적으로 연동해서 빅데이터 처리

구글: 검색엔진 대량 데이터 효율적으로 저장 및 처리, 클라우드 데이터 형태로 Firebase인 Claude FireStore → 문서(document)형태의 nosql 지원

아마존: DynomoDB 완전 관리형 NoSQL, AWS 플랫폼에서도 사용 가능
```

<br>

### 집합 지향(Aggregate orientation)

- 데이터를 집합(aggregate) 단위로 구성하고 관리하는 데이터 모델링 접근방식

- 어떤 DB를 쓸까 고민할 때 집합 지향이라는 특성을 가지고 내가 다루는 데이터는 어떤 특성이 있으며, 어떻게 관리되어야 하는지 고민해야한다.

  - 관계형 DB는 정규화를 하고 잘게 쪼개 테이블 단위로 저장
    - 예) 주문 고객 주문번호 카드번호 정규화 원칙에 따라 잘게 쪼갬

  - NoSQL은 연관성 있는 데이터를 집합이라는 단위로 모아서 저장
    - 예) 하나의 문서로 묶여있음. id 값을 키로 사용해서 모든 주문정보 등을 집합(document 단위)으로 관리

<br>

**집합의 경계를 어떻게 결정해야 하는가?**
```
고객 정보 주문 정보 별도로 저장 → 고객이라는 큰 정보 안에 주문 정보가 포함

집합의 경계를 어떻게 결정하느냐에 따라 데이터 구성 자체가 달라진다.

고객과 주문을 별도로 관리할지? 고객 정보 안에 주문 정보를 넣어서 관리할지?

애플리케이션의 성능과 확장성 결정

따라서 주의해야 한다. 그리고 개발자 역량과 상황에 따라서 집합의 경계를 만들면 된다.
```

<br>

### Key-Value Database

- 데이터를 키(Key)와 값(Value)의 쌍으로 저장하는 단순한 데이터 모델
- Redis나 DynamoDB가 대표적인 예시
- 빠른 응답속도가 필요하거나, 데이터 구조가 단순할 때 최적의 성능
    - 빠른 성능
        - Key만 알면 데이터에 직접 접근 가능 → 검색 속도가 매우 빠름
        - Python의 딕셔너리나, Java의 Map처럼 동작
    - 유연한 데이터 저장
        - 데이터 형태에 거의 제약이 없다.
        - 즉, 값에 어떤 형태의 데이터든 넣을 숫 있다.
        - JSON, XML, 바이너리 데이터 등 포함
    - 캐싱 시스템, 실시간 애플리케이션, IoT 데이터 저장 등 단순한 데이터 저장 및 조회

<br>

### Document-Oriented Database

- JSON이나 XML같은 문서 형식의 데이터 저장
    - 문서 내부의 구조를 기반으로 쿼리와 인덱싱
- 문서 중심 데이터 모델
    - 문서 내부 집합의 단위가 데이터의 기본 단위가 된다.
- 유연한 스키마
    - 문서의 필드와 데이터 형식이 사전에 정의되지 않음
    - 즉, 별도의 스키마 지정 x
    - 문서마다 별도의 필드와 데이터형식 가질 수 있음
- 데이터 독립성
    - 하나의 문서 안에 필요한 모든 정보 담을 수 있음
    - 관계형DB처럼 조인할 필요 없음
    - 필요한 정보를 한번에 가져올 수 있어 효율적
- 계층적 비정형 콘텐츠에 최적화
    - 각각의 필드나 내용 구성이 다른 경우
    - 제품정보, 리뷰, 블로그, 뉴스 아티클 등

<br>

**Key-Value Database와 Document-Oriented Database의 차이**

- 키밸류는 단순하고 직접적인 접근만 가능. JSON형태로 저장해서 해도 되지만. 쿼리문을 통한 질의로 밸류 내부 세부조회는 불가능

- 문서는 문서 구조가 계층적이고 북잡. 가격 만원 이상 서울에 있는 상품 ⇒ 특정 필드를 검색하거나 복잡한 쿼리 가능

<br>

**Document-Oriented Database와 RDBMS의 차이**

- Document-Oriented: 스키마에 대한 검증 필요 X
- RDBMS는 중복 자체를 허용하지 않는 반면, Document-Oriented는 일관성이 깨질 염려가 있다.

<br>

```
💡

제약조건이나 트랜잭션이 상당히 많이 개선됐지만

결과적으로 정규화를 안하게 되면 동일한 문제 발생

일관성이 중요하다면 차라리 RDBMS가 낫다.(은행처럼)

```

<br>

### Column-Family Database

- 행과 열의 집합으로 관리
- 대규모 데이터 처리와 빠른 읽기/쓰기에 최적화
- 동적 스키마
    - 데이터가 유연, 각 행의 컬럼 수와 형식이 다를 수 있음(유연)
- 수평적 확장성
    - 데이터를 여러 노드에 분산하여 저장하고 관리
    - 대용량 데이터 처리에 적합
- cassandra, ScyllaDB, HBase 등
- 거대 클러스터를 통해 처리 가능한 DB
- 클러스터가 많을수록 처리량은 뛰어나지만 응답속도, 레이턴시, 네트워크 통신 필요하므로 결과적으로는 응답속도가 길어질 수 있음
- 사용자 행동 로그 및 이벤트 데이터 저장, IoT 데이터 등에 주로 사사용

<br>

**NoSQL의 공통점**
- 스키마리스
    - 고정된 스키마 요구 X, 데이터 구조 유연
    - 데이터의 형태가 자주 변경되거나 다양한 구조를 처리할 때 적합
- 높은 확장성
    - 데이터를 여러 노드에 분산 저장하여 수평적 확장 가능
- 빠른 읽기/쓰기 성능
    - 디스크 I/O나 네트워크 호출 최소화하여 빠른 처리속도 제공
    - 특히 대용량 데이터 다룰 때 이러한 처리속도가 중요
- 분산 아키텍처
    - 데이터를 여러 서버에 복제하고 분산 저장
    - 하나의 서버에서 문제가 생기는 경우에도 전체 시스템에서는 제대로 동작하게끔 할 수 있다.(장애시 여러 노드에서 데이터 접근 가능) → 고가용성
    - 지리적으로 떨어진 지역에서도 해당 데이터를 가져와서 사용 가능 → 내결함성 보장

<br>

## Firebase

### Firebase란?

- NoSQL 기반 백엔드 서버

- 구글에서 제공하는 종합 앱 개발 플랫폼

- 채팅, 로그인, 데이터저장 등을 레고 조립하듯이 조합해서 하나의 애플리케이션 개발 가능

- 전통적인 백엔드 개발의 복잡성을 줄여주는 Backend as a Service → Baas 솔루션

- 모니터링도 지원, 사용자 분석 앱 테스트 등 지원

<br>

**무엇을 지원하나?**

1. 앱개발(백엔드)
    - 가입 인증
    - 클라우드 호스팅
    - Firestore 데이터 모델링
    - 클라우드 저장소 제공
2. 앱기능 확장 및 향상
    - 실시간 충돌 데이터 확인
    - 앱 퍼포먼스 모니터링
    - 기기별 테스트 지원
3. 앱 성장(분석)
    - 사용자 성향이나 이용 분석 도구
    - 앱에서 클라우드 메시지 푸시 fcm

<br>

**주요기능**

- 서버리스 백엔드 플랫폼
    - 별도 서버 구축(구현) 없이 DB, 인증, API 등 제공
- 실시간 데이터베이스
    - 클라이언트 간 실시간 데이터 동기화 가능한 NoSQL 클라우드 데이터베이스
- 호스팅 서비스
    - 웹사이트나 앱을 쉽게 배포하고 호스팅 가능
- 분석 도구
    - 구글 애널리틱스 제공
    - 앱 사용성, 충돌 보고서, 사용자 행동 등을 추적하고 분석하는 기능 제공
    - 서비스 개선에 많은 도움이 된다.

<br>

### 초기 설정

1. Firebase 콘솔 접속(firebase.google.com)
2. 프로젝트 생성
    - 가능하면 고유한 프로젝트 명 → 호스팅 시 도메인 네임을 깔끔하게 진행 가능
    - 개발 단계에서는 분석이 큰 의미가 없고, 불필요한 로그만 쌓인다.
      - → google 애널리틱스 일단 비활성화(나중에 다시 켤 수 있음)
3. 데이터베이스 생성(Firestore)
    - 왼쪽 탭 - 빌드 - Firestore Database
    - 서버 위치정보는 응답속도나 법적인 문제와 관련해서 국내내로 설정하는 게 차후 유지보수에 유리(나중에 변경 불가)
    - 프로덕션 모드에서 시작(모든 읽기 쓰기 차단되는 모드 → 보안 규칙 직접 설정해줘야 데이터에 접근 가능)
4. 컬렉션 생성
    - 컬렉션은 document들을 저장하는 폴더 개념
    - 컬렉션 ID는 명확하게 정의할 것
5. Vue 설정(Firebase SDK)
    - SDK: software development kit
    - firebase와 통신하는데 필요한 모든 도구가 담겨있는 키트
    - 웹 앱과 firebase 연결다리
        
        ![image.png](image.png)
        
    1. 웹 앱을 추가하여 시작하기
    2. npm install firebase vuefire
        - 의존성 문제 → firebase 버전 10으로 다운그레이드
        - env에 firebaseConfig 관련 데이터 따로 저장

<br>

**FirestoreDB vs Realtime DB**

- Cloud Firestore는 권장되는 엔터프라이즈급 JSON 호환 문서 데이터베이스
    - 성능, 추가 기능 상 권장
- Realtime Database는 기본 Firebase JSON 데이터베이스
  - 간단한 조회와 확장성이 제한적이며 지연 시간이 짧은 동기화가 필요한 단순한 데이터 모델을 사용하는 애플리케이션에 적합함

<br>

### Firebase에서 데이터 가져오기

<br>

1. vue 프로젝트와 firebase 데이터베이스 포맷 통일
   - `src/views/HomePages.vue`의 필드와 동일하게 Firebase 데이터베이스 필드 설정

<br>

2. 컬렉션 가져오기
    - 컬렉션을 가져오기 위한한 코드 가져오기(여러 문서 가져오기 - db명 변경: ssafy-cafe)
    - 데이터 베이스를 사용하기 위한 db 변수 정의
    - 원래 `firebaseApp`으로 불러와야 하지만 `useFirestore`를 통해 편리하게 이용 가능
      - 참고: [https://firebase.google.com/docs/firestore/query-data/](https://firebase.google.com/docs/firestore/query-data/get-data?hl=ko&_gl=1*1mp99f2*_up*MQ)
    
    ```jsx
    import { useFirestore } from 'vuefire'
    const db = useFirestore();
    
    const q = query(collection(db, "ssafy-cafe"));
    
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
    });
    
    ```

    <br>
    
    - 이후 진행하면 permission이 부족하다고 뜰 것이다.
    - firebase 데이터베이스 - 규칙 - 권한작성 - 콘솔출력확인
        
        ```jsx
        import { collection, query, where, getDocs } from "firebase/firestore";
        
        const q = query(collection(db, "cities"), where("capital", "==", true));
        
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data());
        });
        ```

    <br>    
    
    - 컬렉션 데이터를 반응형 변수에 넣기. 기존의 `cafeCollection`은 삭제.
    
      ```jsx
      const cafeCollection = ref([])
      
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
        cafeCollection.value.push(doc.data());
      });
      ```
    
3. 데이터베이스 실시간으로 불러오기
    - firebase 문서를 수정해도 페이지에는 자동 반영 X
        - 실시간 데이터 동기화가 진행되지 않았기 때문
        - `onSnapshot` 설정 필요
        - DB 업데이트 될 때마다 콜백함수 실행 → 계속 같은 데이터가가 추가되는 불상사가 발생할 수 있다!
        - 따라서 초기에 배열 초기화 필요
        
        ```jsx
        import { collection, query, where, onSnapshot } from "firebase/firestore";
        
        const db = useFirestore();
        const cafeCollection = ref([])
        
        const q = query(collection(db, "ssafy-cafe"));
        
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          cafeCollection.value = [];
          querySnapshot.forEach((doc) => {
              cafeCollection.value.push(doc.data());
          });
        });
        
        // const querySnapshot = await getDocs(q);
        // querySnapshot.forEach((doc) => {
        //   // doc.data() is never undefined for query doc snapshots
        //   console.log(doc.id, " => ", doc.data());
        //   cafeCollection.value.push(doc.data());
        // });
        ```
        
        <br>
        
        - 코드 간단하게 다듬기 →  `useCollection`
        
        ```jsx
        import { useFirestore, useCollection } from 'vuefire'
        import { collection, query, where, onSnapshot } from "firebase/firestore";
        
        const db = useFirestore();
        const cafeCollection = useCollection(collection(db, "ssafy-cafe"));
        
        // const unsubscribe = onSnapshot(q, (querySnapshot) => {
        //   cafeCollection.value = [];
        //   querySnapshot.forEach((doc) => {
        //       cafeCollection.value.push(doc.data());
        //   });
        // });
        
        // const querySnapshot = await getDocs(q);
        // querySnapshot.forEach((doc) => {
        //   // doc.data() is never undefined for query doc snapshots
        //   console.log(doc.id, " => ", doc.data());
        //   cafeCollection.value.push(doc.data());
        // });
        ```
        
<br>

### Firebase에 데이터 추가하기

1. 문서추가를 위한 메서드 호출
   
    - `setDoc` 또는 `addDoc` 활용
      - `setDoc`: 문서를 생성할 때 id 지정
      - `addDoc`: 문서 생성 시 자동으로 id 생성(시간+랜덤 ⇒ 고유 id, 즉 시간순으로 정렬 가능)
      - 체계적으로 id 관리하고 싶다면 `setDoc`, 단순히 문서 추가하고 싶다면 `addDoc`

      <br>

    - `addDoc` 사용하기
        - addDoc은 비동기함수이므로 `await` 사용
        - 객체 선언 → 고유 id 생성해서 문서 추가
        
        ```jsx
        // router에 추가
        import { createRouter, createWebHistory } from 'vue-router'
        import HomePage from '@/views/HomePage.vue'
        import NewCafePage from '@/views/NewCafePage.vue'
        
        const router = createRouter({
          history: createWebHistory(import.meta.env.BASE_URL),
          routes: [
            {
              path: '/',
              name: 'home',
              component: HomePage,
            },
            {
              path: "/new",
              name: 'new',
              component: :NewCafePage,
            }
          ],
        })
        
        export default router
        ```
        
        <br>

        - 네비게이션 바에 추가
        ```html
        <v-btn to="/new">NEW</v-btn>
        ```

        <br>

        - NewCafePage- addcafe 수정
        ```jsx
        import { collection, addDoc } from "firebase/firestore"
        import { useFirestore } from 'vuefire'
        
        const newCafe = ref({
          name: '',
          rating: 0,
          location: '서울시 강남구',
          price: 3000,
          favorite: false,
        })
        
        const db = useFirestore();
        
        const addCafe = async () => {
          const docRef = await addDoc(collection(db, "ssafy-cafe"), {...newCafe.value});
          console.log("Document written with ID: ", docRef.id);
        }
        ```

        <br>

        - 추가시 홈으로 돌아오는 라우터 설정
        ```jsx
        import { ref } from 'vue'
        import { collection, addDoc } from "firebase/firestore"
        import { useFirestore } from 'vuefire'
        import { useRouter } from 'vue-router'
        
        const router = useRouter();
        
        const newCafe = ref({
          name: '',
          rating: 0,
          location: '서울시 강남구',
          price: 3000,
          favorite: false,
        })
        
        const db = useFirestore();
        
        const addCafe = async () => {
          try{
            const docRef = await addDoc(collection(db, "ssafy-cafe"), {...newCafe.value});
            console.log("Document written with ID: ", docRef.id);
            router.push("/")
          }catch{
            console.error('문서 추가중 에러 발생')
          }
        }
        ```
        
<br>

### 데이터 수정하기

1. 수정버튼 활성화
    - 수정페이지 연결
        
        ```html
        <!-- CafeCard.vue -->
        
          <v-btn color="primary" :to="`/cafe/${cafe.id}`">
            <v-icon icon="mdi-pencil" class="mr-1" /> 수정
          </v-btn>
        ```

        ```jsx
        // router 설정
        {
          path: '/cafe/:id',
          name: "edit",
          component: EditCafePage,
        }
        ```

<br>

2. 수정할 데이터 가져오기
    - doc 메서드 통해 데이터 불러오기
        ```jsx
        import { ref } from 'vue'
        import { useRouter, useRoute } from 'vue-router'
        import FormLayout from '@/layouts/FormLayout.vue'
        import { useFirestore } from 'vuefire'
        import { doc, getDoc } from 'firebase/firestore'
        
        const route = useRoute();
        const router = useRouter();
        
        const db = useFirestore();
        
        const docRef = doc(db, "ssafy-cafe", route.params.id);
        const docSnap = await getDoc(docRef);
        
        const cafe = ref({})
        
        if (docSnap.exists()) {
          cafe.value = docSnap.data();
        } else {
          // docSnap.data() will be undefined in this case
          console.log("No such document!");
        }
        const updateCafe = () => {
          console.log(cafe.value)
        }
        ```
        - doc: 해당 db의 해당 id를 가진 문서를 참조하라는 뜻뜻
        - 포인터같은 개념
        - 가지고 온것은 아닌데 빠르게 참조하기 위해 생성된 객체
        - 비동기 네트워크 통신에서 진행되므로 await 키워드 사용용
        
    <br>

    - `watch`를 통해 불러온 데이터를 반응형 변수에 넣어주기   
        ```jsx
        import { ref, watch } from 'vue'
        import { useRouter, useRoute } from 'vue-router'
        import FormLayout from '@/layouts/FormLayout.vue'
        import { useFirestore, useDocument } from 'vuefire'
        import { doc, getDoc } from 'firebase/firestore'
        
        const route = useRoute();
        const router = useRouter();
        
        const db = useFirestore();
        const cafe = ref({})
        const docRef = doc(db, "ssafy-cafe", route.params.id);
        // const docSnap = await getDoc(docRef);
        const cafeSource = useDocument(docRef);
        
        // if (docSnap.exists()) {
        //   cafe.value = docSnap.data();
        // } else {
        //   // docSnap.data() will be undefined in this case
        //   console.log("No such document!");
        // }
        
        watch(cafeSource, (newCafe) => {
          cafe.value = {...newCafe}
        })
        // const updateCafe = () => {
        //   console.log(cafe.value)
        // }
        ```
        - `useDocument` 사용 시 쉽게 가져올 수 있음
        - 읽기 전용 반응형 객체이므로 자동으로 바뀌도록 설정
        - 읽기 전용이므로 수정하기가 어려움 → 외부적으로 사용해서 바뀔 때마다 watch로 감시, 바뀌면 cafe 데이터를 같이 변경
        
<br>
      
3. 가져온 데이터 수정
    - `updateDoc` 메서드 사용용
    - 마찬가지로 비동기이므로 await, async 사용해서 동기식으로 작동하도록 코드 작성
    
    ```jsx
    import { ref, watch } from 'vue'
    import { useRouter, useRoute } from 'vue-router'
    import FormLayout from '@/layouts/FormLayout.vue'
    import { useFirestore, useDocument } from 'vuefire'
    import { doc, getDoc, updateDoc } from 'firebase/firestore'
    
    const route = useRoute();
    const router = useRouter();
    
    const db = useFirestore();
    const cafe = ref({})
    const docRef = doc(db, "ssafy-cafe", route.params.id);
    // const docSnap = await getDoc(docRef);
    const cafeSource = useDocument(docRef);
    
    // if (docSnap.exists()) {
    //   cafe.value = docSnap.data();
    // } else {
    //   // docSnap.data() will be undefined in this case
    //   console.log("No such document!");
    // }
    
    watch(cafeSource, (newCafe) => {
      cafe.value = {...newCafe}
    })
    
    const updateCafe = async () => {
      // console.log(cafe.value)
      await updateDoc(docRef, cafe.value)
      router.push('/')
    }
    ```
    
<br>

### 데이터 삭제

1. 삭제버튼 활성화
    - disabled 구문 삭제 및 deleteCafe 메서드 연결
    
    ```html
    <v-btn color="error" text @click="deleteCafe">
      <v-icon icon="mdi-trash-can-outline" class="mr-1" />
      삭제
    </v-btn>
    ```
    
2. `deleteDoc` 호출
    
    ```jsx
    import { computed } from 'vue'
    import { deleteDoc, doc } from 'firebase/firestore'
    import { useFirestore } from 'vuefire'
    
    const db = useFirestore();
    
    const deleteCafe = async() => {
      const docRef = doc(db, 'ssafy-cafe', props.cafe.id)
      await deleteDoc(docRef)
    }
    ```
    
<br>

### Firebase 인증

- 사용자인증/관리 기능을 서버 측 코드 없이 유지 관리가 가능하게 하는 firebase 서비스 중 하나
- 데이터를 다루는 환경? 보안이 중요하다. 대규모의 앱에서는 더더욱!
- 빌드 - Authentication 에서 설정 가능능

<br>

**사용자 인증이란?**

- 사용자, 계정 정보 보호
- 비밀번호 암호화
- 사용자의 신원 인증

  → Firebase를 통해 소셜로그인 등 비밀번호 없는 로그인 기능 구현 가능

<br>

1. Firebase Auth 활성화
    - 로그인 방법 선택 → 이메일/비밀번호
        - 소셜로그인도 추가적으로 제공
    - 사용 설정 토글버튼 활성화
        - firebase의 SDK 덕분에 기능을 구현할 필요 없다!!

<br>

2. VueFire를 통한 Auth 설정
    - `VueFireAuth` 가져오기
        
        ```jsx
        // main.js

        import { VueFire, VueFireAuth } from 'vuefire'
        app.use(VueFire, {
        	firebaseApp: createFirebaseApp(),
        	modules: [
        		// ... other modules
        		VueFireAuth(),
        	],
        })
        ```
        
<br>

3. 사용자 등록하기(비밀번호 기반 계정 만들기)

    - 회원가입을 위한 route 추가
        
        ```jsx
        // router/index.js
        
        {
        	path: '/signin',
        	name: 'signin',
        	component: SignInPage,
        },
        
        ```
        
        ```html
        <!-- components/AppNavbar.vue -->
        
        <nav class="pr-4">
          <v-btn to="/">Home</v-btn>
          <v-btn to="/new">NEW</v-btn>
          // <v-btn to="/signin">SIGN IN</v-btn>
        </nav>
        
        ```
    
    <br>

    - useFireAuth 객체 불러오기/newUser 변수 정의
        
        ```jsx
        // SignInPage.vue
        
        import { useRouter } from 'vue-router'
        import { useFirebaseAuth } from 'vuefire'
        import { createUserWithEmailAndPassword } from 'firebase/auth'
        
        const router = useRouter();
        const newUser = ref({
          email: '',
          password: '',
        })
        
        const auth = useFirebaseAuth()
        ```
    
    <br>

    - `createUser` 메서드 연결하기
        
        ```html
        <!-- SignInPage.vue - <script> -->
        
        <v-btn @click="signIn" variant="tonal" color="primary">
        	로그인
        </v-btn>
        <v-btn @click="createUser" variant="tonal" color="secondary">
          새 사용자 생성
        </v-btn>
        ```
        
        ```jsx
        
        // SignInPage.vue - <template>
        
        async function createUser() {
          try {
            await createUserWithEmailAndPassword(
              auth,
              userInput.value.email,
              userInput.value.password
            )
            router.push('/')
          } catch (error) {
            console.error('회원가입 실패:', error)
          }
        }
        ```
        
<br>

4. 사용자 인증 여부에 따른 버튼 변경
    - 유저 정보 가져오기
        
        ```jsx
        // AppNavbar.vue - <script>
        
        import { useCurrentUser } from 'vuefire'
        
        const user = useCurrentUser()
        ```
        
        ```html
        <!-- AppNavbar.vue - <template> -->
        
        <nav class="pr-4">
          <v-btn to="/">Home</v-btn>
          <v-btn to="/new">NEW</v-btn>
          <v-btn v-if="user?.email" @click="signOutofFirebase">LOGOUT</v-btn> // user나 user.email 대신 이걸 쓰는 이유: user는 object라서 항상 참(비어있는 array여도) optional chain의 경우 undefined일 경우가 있기 때문에 명시적으로 optional chain을 사용 
          <v-btn v-else to="/signin">SIGN IN</v-btn>
        </nav>
        ```

<br>

5. 로그인/로그아웃 기능 구현
    - signOut을 호출하여 로그아웃 하기
        
        ```jsx
        // AppNavbar.vue - <script>
        
        import { useCurrentUser, useFirebaseAuth } from 'vuefire'
        import { signOut } from '@firebase/auth'
        
        const user = useCurrentUser()
        
        const auth = useFirebaseAuth()
        
        async function signOutofFirebase = () => {
          signOut(auth)
            .then(() => {
              console.log('로그아웃 성공!')
            })
            .catch((error) => {
              console.error(error)
            })
        }
        ```
    
    <br>

    - 로그인 구현하기
        
        ```jsx
        // SignInPage.vue - <script>
        
        
        import { createUserWithEmailAndPassword, signInWithEmailAndPassword, } from 'firebase/auth'
        
        const signIn = () => {
          try {
            await signInWithEmailAndPassword(
              auth,
              userInput.value.email,
              userInput.value.password
            )
            router.push('/')
          } catch (error) {
            console.error('로그인 실패:', error)
          }
        }
        
        ```