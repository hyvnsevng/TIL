# PostgreSQL
왜 Postgre?
- 1위 Oracle과 높은 호환성(90% 이상 스키마 호환성 제공)
- DB-Engines 산정 기준 4위 DBMS
- Cloud 서비스 확대에 따라 전문 업체들이 오픈소스 DBMS 지원 늘리고 있음

## 서버 설치하기
- https://www.postgresql.org/download/
- https://www.enterprisedb.com/downloads/postgres-postgresql-downloads
- 버전 선택 후 다운
- 사용 Port 설정(MySQL은 3306) - 기본 5432 Port 사용


## Database 생성
- 기본 관리 Tool pgAdmin4 실행(MySQL의 Workbench에 해당)
  - 최초 실행 시 Local에 설치된 PostgreSQL에 postgres 계정으로 로그인
  - 설치 시 등록한 비밀번호 입력
- Database 생성
  - 연결된 PostgreSQL17 서버를 확장 후 Database 우클릭
  - Create > Database 선택
  - Database 명, Comment 작성 후 Save
  - 생성된 Database 확인

## Schema 생성
- Database 확장
- Schemas 우클릭 Create > schema 선택
- Schema 명, 코멘트 작성 후 Save
- 생성된 Schema 확인


## Table 생성(GUI)
- Schema 확장
- Tables 우클릭 Create > Table 선택
- General Tab
  - Table 명, Table space, Comment 작성
- Columns Tab
  - Column 생성하기
  - `+` 클릭 시 row 생성
- SQL Tab
  - 지금까지 GUI로 만든 Table 생성 쿼리 확인 가능
  - Save 하여 Table 생성

## Sequence 객체 생성 및 사용
### Sequence란?
- 자동으로 증가 혹은 감소하는 숫자를 생성시키는 객체
- MySQL에서는 AUTO INCREMENT 속성으로 처리하였으나, Oracle, PostgreSQL 등에서는 Sequence 객체를 통해 관리
- SELECT LAST_VALUE FROM <Sequence명> : 시퀀스 객체의 현재 값값
- NEXTVAL(Sequence명) : 시퀀스 객체의 다음 값

### Sequence 생성
- Sequences 우클릭  Create > Sequence 선택
- General Tab
  - Sequence명, Comment 작성
- Defination Tab
  - Increment(호출 당 증가값), Start(시작값) 등 다양한 옵션 지정 가능
    - Owned by 에 TBL_USER 와 user_seq를 binding 시키면 해당 테이블의 열이 삭제될 경우 이 시퀀스도 같이 삭제됨
  - Save 후 생성된 sequence 확인

## Query Tool에서 다양한 Query 작성해보기
- `"Schema명"."객체명"`으로 객체 접근
- Query Tool 생성
- Database 우클릭 후 Query Tool 선택
- 테이블 조회 쿼리
  ```sql
  SELECT * FROM "PRJ1"."SEQ_USER";
  ```
- `SEQ_USER`의 현재 값 조회
  ```SQL
  SELECT LAST_VALUE FROM "PRJ1"."SEQ_USER"
  ```
- `TBL_USER` 테이블에 Sequence를 이용해 Data Insert
  ```sql
  INSERT INTO "PRJ1"."TBL_USER"(user.seq, user_id, user_name, user_pass, user_level)
  VALUES(NEXTVAL("PRJ1"."SEQ_USER"), 'id1', '사용자이름1', 'pass', '1');
  ```


## Database 백업하기
- Database 우클릭 후 Backup 선택
  - `Utility Not Found`오류 발생 시 https://while1.tistory.com/66 참고
- Backup 실행
  - 파일 경로 및 Format(Plain), Encoding(EUC_KR) 설정


