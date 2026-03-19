# Two Services: Python App + Postgres

## Goal

Connect a Python Flask API to a Postgres database using environment variables and a named volume.

## Requirements

1. Service `db`: Postgres 15, credentials from `.env`, named volume for persistence.
2. Service `api`: Python Flask app built from the local `Dockerfile`, depends on `db`.
3. `api` exposed on port `5000`.
4. All secrets in `.env` — nothing hardcoded in `docker-compose.yml`.
5. Data must survive `docker compose down` (but NOT `docker compose down -v`).

## File Structure

```
01_easy_medium/
├── docker-compose.yml  
├── .env                 
├── Dockerfile         
└── app/
    └── main.py        # provided
```

## Verify

```bash
docker compose up -d --build
curl http://localhost:5000/
# Expected: {"status": "ok", "db": "connected"}

docker compose down      # stop — data survives
docker compose up -d     # restart — data still there
docker compose down -v   # full cleanup
```
