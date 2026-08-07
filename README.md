# Docker Chat Workshop — v2

A simple multi-container chat application for demonstrating Docker,
Docker Compose, container networking, WebSockets, reverse proxying,
and Redis pub/sub.

## Architecture

Browser -> Nginx -> chat1/chat2 -> Redis

Nginx serves the web page and proxies WebSocket connections to chat1/chat2.
The two Node.js containers use Redis pub/sub to synchronize messages.

## Run

```bash
docker compose up --build
```

Open http://localhost:8080 in two browser tabs.

You should see messages such as:

```text
Alice: Hello!
handled by chat1

Bob: Hi Alice!
handled by chat2
```

## Useful commands

```bash
docker compose ps
docker compose logs -f
docker compose logs -f chat1
docker compose logs -f chat2
docker compose exec chat1 sh
docker compose exec chat1 ping redis
docker network ls
docker compose down
```

## Workshop experiments

Stop one chat server:

```bash
docker compose stop chat1
```

Start it again:

```bash
docker compose start chat1
```

Stop Redis:

```bash
docker compose stop redis
```

Start it again:

```bash
docker compose start redis
```

Inspect service discovery:

```bash
docker compose exec chat1 sh
ping redis
```

Inspect environment variables:

```bash
docker compose exec chat1 env
```

Inspect Nginx:

```bash
docker compose exec web cat /etc/nginx/nginx.conf
```

## Teaching sequence

1. Explain why applications have multiple dependencies.
2. Introduce containers as isolated application environments.
3. Run `docker compose up --build`.
4. Open two browser tabs and chat.
5. Run `docker compose ps`.
6. Explain the four containers.
7. Explain Docker Compose networking.
8. Demonstrate chat1 -> redis using the service name.
9. Explain Nginx as the entry point.
10. Show the WebSocket proxy configuration.
11. Stop chat1 and observe what happens.
12. Stop Redis and observe what happens.
13. Discuss scaling and load balancing.

## Troubleshooting

If the browser shows "Connection closed":

```bash
docker compose down
docker compose up --build
docker compose logs web
docker compose logs chat1
docker compose logs chat2
```

Then open http://localhost:8080 again.

For a completely fresh rebuild:

```bash
docker compose down
docker compose build --no-cache
docker compose up
```
