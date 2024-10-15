# 다중 테이블 쿼리(Multi Table Queries)

## JOIN
관계 : 여러 테이블간의 논리적 연결

- 테이블을 분리하면 데이터 관리는 용이해질 수 있으나 출력시에는 문제가 있음
- 테이블 한 개 만을 출력할 수 밖에 없어 다른 테이블과 결합하여 출력하는 것이 필요해짐
- 이때 `JOIN` 사용하여 둘 이상의 테이블에서 데이터 검색


### INNER JOIN
> 두 테이블에서 값이 일치하는 레코드에 대해서만 결과를 반환
```sql
SELECT select_list 
FROM table_a
INNER JOIN table_b
  ON table_b.fk = table_a.pk;
```
- FROM 절 이후 메인 테이블 지정(table_a)
- INNER JOIN 절 이후 메인 테이블과 조인할 테이블 지정(table_b)
- ON 키워드 이후 JOIN 조건 작성
  - JOIN 조건: table_a와 table_b 간의 레코드를 일치시키는 규칙을 지정

**INNER JOIN 활용**
```SQL
SELECT articles.title, users.name
FROM articles
INNER JOIN users
  ON users.id = articles.userId
WHERE users.id = 1;
```
- 1번회원이 작성한 모든 게시글의 제목과 작성자명 조회하기

### LEFT JOIN
> 오른쪽 테이블의 일치하는 레코드와 함께 왼쪽 테이블의 모든 레코드 반환
```sql
SELECT select_list
FROM table_a
LEFT JOIN table_b
  ON table_b.fk = table_a.pk;
```
- FROM절 이후 왼쪽 테이블 지정(table_a)
- LEFT JOIN 절 이후 오른쪽 테이블 지정(table_b)
- ON 키워드 이후 JOIN 조건 작성
  - 왼쪽 테이블의 각 레코드를 오른쪽 테이블의 모든 레코드와 일치시킴

**LEFT JOIN 활용**
```SQL
SELECT articles.name
FROM users
LEFT JOIN articles
  ON articles.userId = users.id
WHERE articles.userId IS NULL;
```
- users: 왼쪽 테이블 / articles: 오른쪽 테이블
- articles의 userId가 users.id인 모든 articles.name 반환
- 근데? articles.userId가 null인 articles.name
- 즉, 게시글 작성하지 않은 사용자의 이름 조회하기
