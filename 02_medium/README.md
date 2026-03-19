# Three Services: Nginx + API + Postgres with Isolated Networks

## Goal

Build a three-tier stack where each layer is network-isolated: a reverse proxy, a Node.js API, and a Postgres database. The database must not be reachable from the proxy directly.

## Architecture

```
Internet -> proxy (port 80) -> api -> db
```

- `proxy` and `api` share the `frontend` network.
- `api` and `db` share the `backend` network (`internal: true`).
- `proxy` cannot reach `db`.
- `db` has no internet access.

## Requirements

1. `proxy`: Nginx reverse proxy, port `80` on host, config from `./nginx/nginx.conf`.
2. `api`: Node.js app built from `Dockerfile`, NOT directly exposed to host.
3. `db`: Postgres 15 with named volume, health check, credentials from `.env`.
4. `api` waits for `db` to be healthy before starting.
5. `proxy` waits for `api` to be healthy before starting.
6. Each service has `restart: unless-stopped`.

## File Structure

```
02_medium/
├── docker-compose.yml   
├── .env                
├── Dockerfile           # provided
├── nginx/
│   └── nginx.conf        
└── src/
    └── server.js        # provided
```

## Verify

```bash
docker compose up -d --build
curl http://localhost/
docker compose exec proxy ping db
docker compose down -v
```
