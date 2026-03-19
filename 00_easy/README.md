# Single Service: Nginx Static Site

## Goal

Run a static HTML website using Nginx inside Docker Compose.

## Requirements

1. Use the `nginx:alpine` image.
2. Map host port `8080` to container port `80`.
3. Serve the `html/` folder as the web root (bind mount).
4. Name the container `my_nginx`.

## Task

Create the following structure and write the `docker-compose.yml`:

```
00_easy/
├── docker-compose.yml
└── html/
    └── index.html
```

The page should display: **"Hello from Docker Compose!"**

## Verify

```bash
docker compose up -d
curl http://localhost:8080
# Expected: Hello from Docker Compose!
docker compose down
```
