# DB 01 SQL
## Database
> 체계적인 데이터 모음
- 데이터를 저장(구조적으로)하고 조작(CRUD)하는데 도움

### 기존의 데이터베이스 저장 방식
1. 파일 이용
- 어디서나 쉽게 사용 가능
- 데이터를 구조적으로 관리하기 어려움
2. 	스프레드 시트 이용
- 테이블의 열과 행을 이용해 데이터를 구조적으로 관리 가능
- 한계
	- 크기: 일반적으로 약 100만 행까지만 저장 가능
	- 보안: 단순히 파일이나 링크 소유 여부에 따른 단순한 접근 권한 기능 제공
	- 정확성: 만약 테이블의 특정 값이 변경된다면 테이블 모든 위치에서 해당 값을 업데이트 해야 함.
		- 찾기 및 바꾸기 기능이 있지만 만약 데이터가 여러 시트에 분산되어 있다면 변경에 누락이 생기거나 추가 문제 발생 가능.

## 관계형 데이터베이스(Relational Database)
> 데이터 간에 관계가 있는 데이터 항목들의 모음
- 테이블, 행, 열의 정보를 구조화하는 방식
- 서로 관련된 데이터 포인터를 저장하고 이에 대한 액세스를 제공
- 관계(여러 테이블 간의 논리적 연결)로 인해 두 테이블을 사용하여 데이터를 다양한 형식으로 조회할 수 있음

**관계형 데이터베이스 관련 키워드**
1. Table(Relation)
	- 데이터를 기록하는 곳
2. Field(Column, Atrribute)
	- 고유한 데이터 형식(타입) 지정
3. Record(Row, Tuple)
	- 구체적인 데이터 값 저장
4. Database(Schema)
	- 테이블의 집합
5. PK(Primary Key)
	- 각 레코드의 고유한 값
	- 관계형 데이터베이스에서 레코드의 식별자로 사용
6. FK(Foreign Key)
	- 다른 테이블의 레코드를 식별할 수 있는 키
	- 다른 테이블의 PK를 참조
	- 각 레코드에서 서로 다른 테이블 간의 관계를 만드는 데 사용

### DBMS
> 데이터베이스를 관리하는 소프트웨어 프로그램
- 데이터 저장 및 관리를 용이하게 하는 시스템
- 데이터베이스와 사용자간의 인터페이스 역할
- 사용자가 데이터 구성, 업데이트, 모니터링, 백업, 복구 등을 할 수 있도록 도움
 
### RDBMS
> 관계형 데이터베이스를 관리하는 소프트웨어 프로그램
- SQLite, MySQL, PostgreSQL, Oracle Database, ...

**데이터베이스 정리**
- Table은 데이터가 기록되는 곳
- Table에는 행에서 고유하게 식별 가능한 기본 키(PK)라는 속성이 있으며,
- 외래 키(FK)를 사용하여 각 행에서 서로 다른 테이블 간의 관계를 만들 수 있음
- 데이터는 기본 키 또는 외래 키를 통해 결합(join)될 수 있는 여러 테이블에 걸쳐 구조화됨

## SQL(Single Table Queries)
> DB에 정보를 저장하고 처리하기 위한 프로그래밍 언어
- 관계형 데이터베이스와의 대화를 위해 사용
- 테이블의 형태로 구조화된 관계형 데이터베이스에게 요청을 질의

1. SQL 키워드는 대소문자를 구분하지 않음
	- 하지만 대문자 작성 권장(**명시적 구분**)
2. 각 SQL 문장의 끝에는 ';' 필요

### SQL문
> SQL을 구성하는 가장 기본적인 코드 블록

```sql
SELECT column_name FROM table_name;
```
- 해당 예시 코드는 SELECT문이라 부름
- 이 문장은 SELECT, FROM 2개의 키워드로 구성

**수행 목적에 따른 SQL Statements 4가지 유형**
|                유형                 |                   역할                  |                  SQL 키워드                   | 
|:-----------------------------------:|:---------------------------------------:|:---------------------------------------------:|
| DDL<br>(Data Definition Language)   | 데이터 정의<br>(기본 구조 및 형식 변경) | `CREATE`<br>`DROP`<br>`ALTER`                 |
| DQL<br>(Data Query Language)        | 데이터 검색                             | `SELECT`                                      |  
| DML<br>(Data Manipulation Language) | 데이터 조작<br>(추가, 수정, 삭제)       | `INSERT`<br>`UPDATE`<br>`DELETE`              |  
| DCL<br>(Data Control Language)      | 데이터 제어<br>(사용자 권한 제어)       | `COMMIT`<br>`ROLLBACK`<br>`GRANT`<br>`REVOKE` |  

### 참고
> 쿼리: 데이터베이스로부터 정보를 요청하는 것
- 일반적으로 SQL로 작성하는 코드를 쿼리문(SQL문)이라 함.
> SQL 표준: 모든 RDBMS에서 SQL 표준을 지원
- 다만 각 RDBMS의 독자적인 기능을 표준을 벗어나는 문법이 존재하니 주의

## DQL(데이터 검색)
#### SELECT문
> 테이블에서 데이터 조회 및 반환
- `table_name`에서 `select_list` 필드의 모든 데이터 조회
```sql
SELECT
	select_list		-- 데이터를 선택하려는 필드
FROM
	table_name;		-- 데이터를 선택하려는 테이블 이름
```
- `*` 사용하여 모든 필드 선택할 수 있음

### 데이터 정렬
#### ORDER BY문
> 조회 결과의 레코드를 정렬
```sql
SELECT
	select_list
FROM
	table_name
ORDER BY
	column1 [ASC|DESC]
```

### filtering
#### DISTINCT문
> 조회 결과에서 중복된 레코드를 제거
```sql
SELECT DISTINCT
	select_list
FROM
	table_name;
```
#### WHERE문
> 조회 시 특정 검색 조건을 지정
```sql
SELECT
	select_list
FROM
	table_name
WHERE
	search_condition;	-- 비교연산자(>, <, >=, <=, =, !=) 및 논리연산자(AND, OR, NOT)
```
## DDL(데이터 기본 구조 및 형식 변경)
#### CREATE TABLE문
> 테이블 생성
```sql
CREATE TABLE table_name (
	column_1 data_type constraints,
	column_2 data_type constraints,
	...,
);
```
```sql
CREATE TABLE examples (
	ExamId INTEGER PRIMARY KEY AUTOINCREMENT,
	LastName VARCHAR(50) NOT NULL,
	Firstname VARCHAR(50) NOT NULL
);
```
#### PRAGMA
> 테이블 schema(구조) 확인
```sql
PRAGMA table_info('examples');
```
- cid:
	- Column ID를 의미하며 각 컬럼의 고유한 식별자를 나타내는 정수 값
	- 직접 사용하지 않으며 PRAGMA 명령과 같은 메타데이터 조회에서 출력 값으로 활용됨

**SQLite 데이터 타입**
1. NULL
- 아무런 값도 포함하지 않음
2. INTEGER
- 정수
3. REAL
- 부동 소수점
4. TEXT
- 문자열
5. BLOB
- 이미지, 동영상, 문서 등의 바이너리 데이터

#### Constraints
- 테이블의 필드에 적용되는 규칙 또는 제한사항
	- 데이터의 무결성을 유지하고 데이터베이스의 일관성을 보장

1. PRIMARY KEY
- 해당 필드를 기본 키로 지정
2. NOT NULL
- 해당 필드에 NULL값을 허용하지 않도록 지정
3. FOREIGN KEY
- 다른 테이블과의 외래 키 관계를 정의
4. AUTOINCREMENT
- 필드의 자동 증가(주로 PK 필드에 적용)
- `INTEGER PRIMARY KEY AUTOINCREMENT`가 작성된 필드는 항상 새로운 레코드에 대해 이전 최대값보다 큰 값을 할당
- 삭제된 값은 무시되며 재사용할 수 없게 됨

### ALTER TABLE
> 테이블 및 필드 조작

**ALTER TABLE 역할**
|          명령어           |       역할       |
|--------------------------:|:----------------:|
|`ALTER TABLE ADD COLUMN`   |     필드 추가    |
|`ALTER TABLE RENAME COLUMN`|  필드 이름 변경  |
|`ALTER TABLE DROP COLUMN`  |     필드 삭제    |
|`ALTER TABLE RENAME TO`    | 테이블 이름 변경 |

1. ALTER TABLE ADD COLUMN
	- ADD COLUMN 키워드 이후 추가하고자 하는 새 필드 이름과 데이터 타입 및 제약조건 작성
	- 단 추가하고자 하는 필드에 NOT NULL 제약조건이 있을 경우 NULL이 아닌 기본 값 설정 필요
```sql
ALTER TABLE 
	examples 
ADD COLUMN 
	Country VARCAHR(100) NOT NULL DEFAULT 'default value';
```
2. ALTER TABLE RENAME COLUMN
	- RENAME COLUMN 키워드 뒤에 이름을 바꾸려는 필드의 이름을 지정하고 TO 키워드 뒤에 새 이름을 지정
```sql
ALTER TABLE examples
RENAME COLUMN Address TO PostCode;
```
3. ALTER TABLE DROP COLUMN 활용
```sql
ALTER TABLE	table_name
DROP COLUMN column_name;
```
4. ALTER TABLE RENAME TO
```sql
ALTER TABLE examples
RENAME TO new_examples;
```

#### DROP TABLE

> 테이블 삭제
```sql
DROP TABLE table_name;
```

### 타입 선호도
- column에 데이터 타입이 명시적으로 지정되지 않았거나 지원하지 않을 때 SQLite가 자동으로 데이터 타입을 추론하는 것

#### SQLite 타입 선호도의 목적
1. 유연한 데이터 타입 지원
	- 데이터 타입을 명시적으로 지정하지 않고도 데이터를 저장하고 조회할 수 있음
	- 컬럼에 저장되는 값의 특성을 기반으로 데이터 타입을 유추
2. 간편한 데이터처리
	- INTEGER Type Affinity를 가진 열에 문자열 데이터를 저장해도 SQLite는 자동으로 숫자로 변환하여 처리
3. SQL 호환성
	- 다른 DB 시스템과 호환성 유지

**반드시 `NOT NULL` 제약을 사용해야 할까?**
- 아니다!
- 하지만 데이터베이스를 사용하는 프로그램에 따라 NULL을 저장할 필요가 없는 경우가 많으므로 대부분 NOT NULL 정의
- null → 0, "" 등으로 대체하는 것을 권장


### DML(데이터 조작)
#### INSERT
```sql
INSERT INTO table_name (c1, c2, ...)
VALUES (v1, v2, ...);
```
- INSERT INTO 다음에 테이블 이름과 괄호 안에 필드 목록 작성
- VALUES 키워드 다음 괄호 안에 해당 필드에 삽입할 값 목록 작성
```sql
INSERT INTO
	articles (title, content, createdAt)
VALUES
	('mytitle', 'mycontent', DATE());
```
- DATE(): 오늘 날짜

#### UPDATE
```sql
UPDATE table_name
SET column_name = expression,
[WHERE condition];
```
- SET 절 다음에 수정할 필드와 새 값을 지정
- WHERE 절에서 수정할 `레코드`를 지정하는 조건 작성
	- WHERE 절 작성하지 않으면 모든 레코드 수정

#### DELETE
> 테이블 레코드 삭제
```sql
DELETE FROM table_name
[WHERE condition];
```
- DELETE FROM 절 다음에 테이블 이름 작성
- WHERE 절에서 삭제할 `레코드`를 지정하는 조건 작성
	- WHERE 절 작성하지 않으면 모든 레코드 삭제

**articles 테이블에서 작성일이 오래된 순으로 레코드 2개 삭제하기**
```sql
DELETE FROM articles
WHERE id = ??;
```
\+
```sql
SELECT id, createdAt
FROM articles
ORDER BY createdAt;
```

```sql
DELETE FROM articles
WHERE id IN ( 
	SELECT id
	FROM articles
	ORDER BY createdAt
	LIMIT 2
);
```
- 작성일 오래된 순으로 정렬한 데이터 중 2개만 조회:
	```sql
	SELECT id
	FROM articles
	ORDER BY createdAt
	LIMIT 2
	```
- 해당 데이터 삭제
	```sql
	DELETE FROM articles
	WHERE id IN(
		...
	)
	```

