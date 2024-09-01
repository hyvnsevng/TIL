# 트리란?
- 루트노드 : 최상위 노드
- 부트리(subtree)
- 단말노드 또는 잎 노드(leaf node)
- 정점
- 간선
- 형제노드 : 같은 부모 노드의 자식 노드들
- 조상노드 : 간선을 따라 루트 노드까지 이르는 경로에 있는 모든 노드들
- 자손노드 : 서브 트리에 있는 하위 레벨의 노드들
- 차수 : 노드에 연결된 자식 노드의 수
- 레벨 :루트에서 노드에 이르는 간선의 수

# 이진트리
- 포화 이진트리
- 완전 이진트리
- 순회 이진트리

이진트리의 순회
전위 순회 : 본인 - 왼쪽 - 오른쪽
중위 순회 : 왼쪽 - 본인 - 오른쪽
후위 순회 : 왼쪽 - 오른쪽 - 본인

개발용 : 연결리스트 사용(class 내 left, right 인스턴스 생성)
코테용 : 인접리스트 사용(갈 수 있는 위치만 저장) -> 트리 구조 상관없이 그래프 탐색처럼 풀이

이진 트리 인접 리스트 저장 방법
```py
N = int(input())
E = N - 1
arr = list(map(int, input().split()))
graph = [[] for _ in range(N + 1)]
# append 를 통해 갈 수 있는 경로를 추가하기
for i in range(E):
    p, c = arr[i * 2], arr[i * 2 + 1]
    graph[p].append(c)


# 없는 경우 -1로 데이터를 저장하기 위한 코드("좌우 경로가 있는가 ?")
# 탐색 시 index 오류를 방지하기 위해 없는 경로를 -1로 저장하였습니다.
for i in range(N + 1):
    while len(graph[i]) < 2:
        graph[i].append(-1)

print(graph)
```

이진 트리 연결 리스트 저장 방법
```py
from collections import deque


class TreeNode:
    def __init__(self, key):
        self.key = key  # 노드의 값
        self.left = None  # 왼쪽 자식 노드를 가리킴
        self.right = None  # 오른쪽 자식 노드를 가리킴

class BinaryTree:
    def __init__(self):
        self.root = None  # 트리의 루트 노드

    # 새로운 노드를 삽입하는 함수 (레벨 순서 삽입)
    def insert(self, key):
        new_node = TreeNode(key)
        if self.root is None:
            self.root = new_node
            return

        # 레벨 순서로 트리를 탐색하기 위해 큐를 사용
        queue = deque([self.root])

        while queue:
            node = queue.popleft()

            # 왼쪽 자식이 비어있으면 삽입
            if node.left is None:
                node.left = new_node
                break
            else:
                queue.append(node.left)

            # 오른쪽 자식이 비어있으면 삽입
            if node.right is None:
                node.right = new_node
                break
            else:
                queue.append(node.right)


tree = BinaryTree()
tree.insert(50)
tree.insert(30)
tree.insert(20)
```