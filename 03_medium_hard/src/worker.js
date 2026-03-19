const redis = require("redis");
const fs = require("fs");

const dbPassword = fs.readFileSync("/run/secrets/db_password", "utf8").trim();

const redisClient = redis.createClient({
  url: `redis://:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:6379`,
});

(async () => {
  await redisClient.connect();
  console.log(`Worker started (PID ${process.pid}), waiting for jobs...`);

  while (true) {
    const job = await redisClient.brPop("jobs", 5); // blocking pop, 5s timeout
    if (job) {
      console.log(`Processing job: ${job.element}`);
      await new Promise((r) => setTimeout(r, 500)); // simulate work
      console.log(`Done: ${job.element}`);
    }
  }
})();