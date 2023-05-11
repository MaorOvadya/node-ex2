const http = require("http");
const server = http.createServer();
const fs = require("fs");
const path = require("path");

// console.log(server)

server.on("request", (req, res) => {
  if (req.url === "/") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    res.write(`
                <h1>Hello Node</h1>
                <a href="http://localhost:8000/read-message">Read Message</a>
                <a href="http://localhost:8000/write-message">Write Message</a>
            `);
    res.end();
  }

  if (req.url === "/read-message" && req.method === "GET") {
    const textPath = path.join(__dirname, "test.txt");
    fs.readFile(textPath, (err, content) => {
      if (err) {
        if (err.code === "Not Found ") {
          res.statusCode = 404;
          res.setHeader("Content-Type", "text/html");
          res.write("<h1>Page Not Found</h1>");
          res.end();
        } else {
          res.statusCode = 500;
          res.setHeader("Content-Type", "text/html");
          res.write("<h1>A Server Error</h1>");
          res.end();
        }
      } else {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(content, "utf8");
      }
    });
  }

  if (req.url === "/write-message" && req.method === "GET") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    res.write(`
            <form method="POST">
            <input type="text" name="text"></input>
            </form>
    `);

    res.end();
  }

  if (req.url === "/write-message" && req.method === "POST") {
    const body = [];
    req.on("data", (chunk) => {
      body.push(chunk);
    });

    req.on("end", () => {
      const parseBody = Buffer.concat(body).toString();
      const message = parseBody.split("=")[1].split("+").join(" ");
      fs.writeFile("sample.txt", message, (err) => {
        if (err) throw err;
        res.statusCode = 302;
        res.setHeader("Location", "/");
        return res.end();
      });
    });
  }
});

server.listen(8000);

console.log(server);
