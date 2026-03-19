# Exercise 4 — Full Stack: Nginx + API + Postgres + Redis + Worker + Profiles + Overrides

**Difficulty:** Hard

## Goal

Build a production-grade multi-service stack with:
- Dev/prod environment split via override files
- Redis as a job queue
- A background worker service scaled to 2 replicas
- Optional monitoring tools behind profiles
- File-based secrets
- Resource limits on all services

## Architecture

```
Internet -> proxy (port 80)
               ^
               |
              api <-->  db (Postgres)
               ^
               |
             cache (Redis)
               ^
               |
            worker × 2
               ^
               |
           flower UI (profile: monitoring)
```

## Requirements

### Services
| Service  | Image / Build | Notes |
|----------|--------------|-------|
| `proxy`  | `nginx:alpine` | Reverse proxy, port 80 |
| `api`    | Build from `Dockerfile` (multi-stage) | Health check on `/health` |
| `db`     | `postgres:15-alpine` | Named volume, health check |
| `cache`  | `redis:7-alpine` | Password-protected, health check |
| `worker` | Same build as `api`, different command | 2 replicas, no `container_name` |
| `flower` | `mher/flower:2.0` | Profile: `monitoring`, port 5555 |

### Networking
- `proxy` → `frontend` only
- `api` → `frontend` + `backend`
- `db`, `cache`, `worker`, `flower` → `backend` only (`internal: true`)

### Secrets
- `db_password` loaded from `./secrets/db_password.txt`
- Mounted at `/run/secrets/db_password` inside `api` and `worker`

### Override files
- `docker-compose.yml` — production base (pull image, no ports on api)
- `docker-compose.override.yml` — dev extras (build locally, bind mount src, expose ports)

### Resource limits
- `api`: 512 MB, 1 CPU
- `worker`: 256 MB, 0.5 CPU each
- `db`: 256 MB
- `cache`: 128 MB

## File Structure

```
03_medium_hard/
├── docker-compose.yml          
├── docker-compose.override.yml  
├── .env                        
├── secrets/
│   └── db_password.txt          
├── nginx/
│   └── nginx.conf               
├── Dockerfile                   
└── src/
    ├── server.js                ← provided
    └── worker.js                ← provided
```

## Verify

```bash
# Dev mode
docker compose up -d --build
curl http://localhost/
# {"status":"ok","db":"connected","cache":"pong"}

curl http://localhost/job
# {"queued": true, "job_id": "..."}

# Confirm 2 worker replicas
docker compose ps | grep worker

# Start monitoring UI
docker compose --profile monitoring up -d flower
# Open http://localhost:5555

# Production mode (no override)
docker compose -f docker-compose.yml up -d

docker compose down -v
```
