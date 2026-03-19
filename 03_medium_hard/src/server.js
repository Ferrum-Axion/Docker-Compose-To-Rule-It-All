const http = require("http");
const { Client } = require("pg");
const redis = require("redis");
const fs = require("fs");
const crypto = require("crypto");

// Read db password from secret file
const dbPassword = fs.readFileSync("/run/secrets/db_password", "utf8").trim();

const pgClient = new Client({
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: dbPassword,
});

const redisClient = redis.createClient({
  url: `redis://:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:6379`,
});

(async () => {
  await pgClient.connect();
  await redisClient.connect();
})();

const server = http.createServer(async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  if (req.url === "/health") {
    res.writeHead(200);
    res.end("ok");
    return;
  }

  if (req.url === "/job") {
    const jobId = crypto.randomUUID();
    await redisClient.lPush("jobs", jobId);
    res.writeHead(202);
    res.end(JSON.stringify({ queued: true, job_id: jobId }));
    return;
  }

  try {
    await pgClient.query("SELECT 1");
    const pong = await redisClient.ping();
    res.writeHead(200);
    res.end(JSON.stringify({ status: "ok", db: "connected", cache: pong.toLowerCase() }));
  } catch (err) {
    res.writeHead(500);
    res.end(JSON.stringify({ error: err.message }));
  }
});

server.listen(3000, () => console.log("API running on port 3000"));

