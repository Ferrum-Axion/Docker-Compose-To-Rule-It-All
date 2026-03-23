const http = require("http");
const fs = require("fs");
const { Client } = require("pg");
const redis = require("redis");

const PORT = process.env.NODE_API_PORT || 3000;
const dbPassword = fs.readFileSync("/run/secrets/db_password", "utf8").trim();

const pgClient = new Client({
  host: "db",
  port: 5432,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: dbPassword,
});

const redisClient = redis.createClient({
  url: `redis://:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:6379`,
});

async function init() {
  await pgClient.connect();
  await redisClient.connect();
  console.log("Connected to Postgres and Redis");
}

const server = http.createServer(async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  if (req.method === "GET" && (req.url === "/" || req.url === "/health")) {
    try {
      await pgClient.query("SELECT 1");
      await redisClient.ping();
      res.writeHead(200);
      res.end(JSON.stringify({ status: "ok", db: "connected", cache: "pong" }));
    } catch (e) {
      res.writeHead(500);
      res.end(JSON.stringify({ status: "error", detail: e.message }));
    }
  } else if (req.method === "GET" && req.url === "/job") {
    const jobId = `job_${Date.now()}`;
    await redisClient.lPush("jobs", jobId);
    res.writeHead(200);
    res.end(JSON.stringify({ queued: true, job_id: jobId }));
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: "not found" }));
  }
});

init()
  .then(() => {
    server.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect:", err);
    process.exit(1);
  });
