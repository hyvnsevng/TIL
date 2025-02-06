## 개요

- 프로젝트에서 채팅 구현을 위해 서버와 실시간 통신 목적의 웹소켓 프로토콜을 사용하게 되었다.<br>
- 우선, 인증된 회원에게 해당되는 채팅방 목록을 불러온다.<br>
- 이후 특정 채팅방 입장 시, 웹소켓 프로토콜에 연결되어 실시간 통신을 진행한다.<br>
  - webScoket endpoint: /allibe-ws (최초 연결 시 http 프로토콜 통해 연결)
  - STOMP 프로토콜 사용
  - 이후 ws 프로토콜로 통신
    - 메시지 publish 경로: /app/message
    - Header -> Authorization: {access-token}
    - chatRequest: `{"content":"test-content", "roomId":"1"}`
    - subscribe 경로: `/topic/rooms/{roomId}`
  - 채팅방 퇴장 시 웹소켓 중단.

**채팅방 로직 흐름**<br>
✔️ 채팅방 목록은 HTTP API로 가져오기<br>
✔️ 입장 시 WebSocket 연결 (`wss://yourserver.com/ws/chat?roomId=123`)<br>
✔️ 퇴장 시 WebSocket 연결 종료 (`ws.close()`)<br>
✔️ 재연결 로직 & 인증 처리 추가 고려<br>

1. 채팅방 목록 불러오기 (HTTP API)

- 로그인한 사용자가 참여한 채팅방 목록을 서버에서 가져옴(REST API).
- 예: GET /api/chat/rooms
- 데이터 예시:

```json
[
  {
    "roomId": "123",
    "name": "Project Team",
    "lastMessage": "See you tomorrow!"
  },
  {
    "roomId": "456",
    "name": "Friend Chat",
    "lastMessage": "Let's meet at 5 PM"
  }
]
```

- UI에 리스트를 렌더링하고 클릭 시 채팅방 입장

2️. 채팅방 입장 (WebSocket 연결)

- 특정 채팅방에 입장하면, WebSocket 프로토콜로 서버에 연결
- WebSocket 주소 예시:
  - `wss://yourserver.com/ws/chat?roomId=123`
  - 쿼리 파라미터를 통해 채팅방 구분
- 연결 후 해야 할 작업
  - 메시지 수신 핸들링 (onmessage)
  - 연결 종료 감지 (onclose)
  - 에러 발생 시 처리 (onerror)
  - 필요하면 재연결 로직 추가

3️. 실시간 채팅 진행

- 메시지 전송
  - 클라이언트 → 서버: WebSocket을 통해 메시지 전송
    ```json
    {
      "type": "message",
      "roomId": "123",
      "sender": "user1",
      "content": "Hello!"
    }
    ```
- 메시지 수신
  - 서버 → 클라이언트: WebSocket으로 다른 사용자의 메시지를 실시간 수신 후 UI에 반영

4️. 채팅방 퇴장 (WebSocket 연결 해제)

- 웹소켓 연결 해제 (`ws.close()`)
- 채팅방을 떠날 때 WebSocket 연결을 종료해야 함
- 필요하면 서버에 "퇴장" 이벤트 전송
  ```json
  {
    "type": "leave",
    "roomId": "123",
    "user": "user1"
  }
  ```
- UI에서 채팅방 화면을 초기화

<br>

**추가 고려할 사항**

1. WebSocket 연결을 어디에서 관리할 것인가?

   - `useEffect`에서 WebSocket을 연결
   - `onUnmounted`에서 연결을 해제
   - `useRef`를 사용하여 WebSocket 객체를 관리

2. 재연결 로직 추가

   - 네트워크 끊김(인터넷 문제)으로 인해 연결이 해제될 경우 자동으로 다시 연결하는 로직 추가
   - 백엔드에서 WebSocket 인증 처리

3. WebSocket 연결 시 토큰(Authorization 헤더 또는 URL 쿼리 파라미터) 인증

   - 예: wss://yourserver.com/ws/chat?token=abc123&roomId=123

4. 알림 기능
   - 사용자가 채팅방을 보고 있지 않을 때, 새 메시지를 받으면 푸시 알림 띄우기기

<br>
