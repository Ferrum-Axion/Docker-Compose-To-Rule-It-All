const http = require("http");

const host = '0.0.0.0';
const port = 3000;

// Request listener: handles incoming HTTP requests
const requestListener = function (req, res) {
  res.writeHead(200, {"Content-Type": "text/plain"}); // Set headers and status
  res.end("Hello from nodejs server!"); // Send response body
};

const server = http.createServer(requestListener);

// Start server
server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
