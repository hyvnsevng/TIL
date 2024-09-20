import heapq

T = int(input())
# Testcase 만큼 반복
for tc in range(1, T + 1):

    n, m = map(int, input().split())

    graph = [[] for _ in range(n+1)]
    for _ in range(m):
        a, b, w = map(int, input().split())
        graph[a].append((b, w))
        # graph[b].append((a, w))     # 양방향일 시 추가

    distance = [1e9]*(n+1)
    start = 0


    def dijkstra(start):
        q = []
        heapq.heappush(q, (0, start))
        distance[start] = 0
        while q:
            dist, now = heapq.heappop(q)
            if dist > distance[now]:    # 이미 처리되었다면 무시
                continue
            for next, cost in graph[now]:
                new_cost = dist + cost
                if new_cost < distance[next]:
                    distance[next] = new_cost
                    heapq.heappush(q, (new_cost, next))


    dijkstra(start)

    print(distance)

'''
3
2 3
0 1 1
0 2 6
1 2 1
4 7
0 1 9
0 2 3
0 3 7
1 4 2
2 3 8
2 4 1
3 4 8
4 6
0 1 10
0 2 7
1 4 2
2 3 10
2 4 3
3 4 10
'''