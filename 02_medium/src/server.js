const http = require("http");
const { Client } = require("pg");

const client = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

client.connect();

const server = http.createServer(async (req, res) => {
  if (req.url === "/health") {
    res.writeHead(200);
    res.end("ok");
    return;
  }

  try {
    await client.query("SELECT 1");
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "hello from api", db: "connected" }));
  } catch (err) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: err.message }));
  }
});

server.listen(3000, () => console.log("API running on port 3000"));

