import net from "node:net";
import fs from "node:fs";
class TCPServer {
  host = "localhost";
  port = 8080;
  server = net.createServer(this.handleConnection.bind(this));

  start() {
    this.server.listen(this.port, this.host, () => {
      console.log(`TCP Server listening on ${this.host}:${this.port}`);
    });

    this.server.on("error", (err) => {
      console.error("Server error:", err);
    });
  }

  handleConnection(socket) {
    console.log("Client connected");

    socket.on("data", (data) => {
      console.log(`Client sent: ${data}`);
      const response = this.handleRequest(data);
      socket.write(response);
      socket.end();
    });

    socket.on("end", () => {
      console.log("Client disconnected");
    });

    socket.on("error", (err) => {
      console.error("Socket error:", err.message);
    });
  }

  handleRequest(data) {
    return Buffer.from("Request received!");
  }
}

class HTTPServer extends TCPServer {
  headers = {
    Server: "myServer",
    "Content-Type": "text/html",
  };

  status_codes = {
    200: "OK",
    404: "Not Found",
    501: "Not Implemented",
    404: "Not Found",
  };

  responseLine(statusCode) {
    const reason = this.status_codes[statusCode] || "Unknown";
    return `HTTP/1.1 ${statusCode} ${reason}`;
  }

  responseHeaders(extraHeaders = {}) {
    const headers = { ...this.headers, ...extraHeaders };
    return Object.entries(headers)
      .map(([key, value]) => `${key}: ${value}`)
      .join("\r\n");
  }

  WithoutHandleRequest(data) {
    const body = `<html>
      <body>
        <h1>Request received!</h1>
      </body>
    </html>`;

    const statusCode = 200;
    const response = [
      this.responseLine(statusCode),
      this.responseHeaders({ "Content-Length": Buffer.byteLength(body) }),
      "", // blank line between headers and body
      body,
    ].join("\r\n");

    return Buffer.from(response);
  }

  handleRequest(data) {
    const request = new HTTPRequest(data);
    const method = request.method;
    const handlerName = `handle_${method}`;

    let handlerFunction;

    try {
      handlerFunction = this[handlerName];
      console.log(handlerFunction);
      if (typeof handlerFunction !== "function") {
        throw new Error("Handler not found");
      }
    } catch (error) {
      handlerFunction = this.HTTP_501_handler;
    }

    const response = handlerFunction.call(this, request);
    return response;
  }

  HTTP_501_handler(request) {
    const responseLine = this.responseLine(501);
    const headers = this.responseHeaders();
    const body = "<h1>501 Not Implemented</h1>";
    return Buffer.from(`${responseLine}\r\n${headers}\r\n\r\n${body}`);
  }
  handle_GET(request) {
    const filename = request.uri.split("/").pop();
    console.log(filename);
    const fileCheck = fs.existsSync(filename);
    let responseLine;
    let response_headers;
    let response_body;
    if (!fileCheck) {
      responseLine = this.responseLine(404);
      response_headers = this.responseHeaders();
      response_body = "<h1>404 Not Found</h1>";
      return Buffer.from(
        `${responseLine}\r\n${response_headers}\r\n\r\n${response_body}`
      );
    }
    responseLine = this.responseLine(200);
    response_headers = this.responseHeaders();
    response_body = fs.readFileSync(filename);
    return Buffer.from(
      `${responseLine}\r\n${response_headers}\r\n\r\n${response_body}`
    );
  }
}

class HTTPRequest {
  method = null;
  uri = null;
  http_version = "1.1";

  constructor(data) {
    this.parse(data);
  }
  parse(data) {
    const lines = data.toString().split("\r\n");
    const request_line = lines[0];
    const words = request_line.split(" ");

    this.method = words[0];
    if (words.length > 1) {
      this.uri = words[1];
    }
    if (words.length > 2) {
      this.http_version = words[2];
    }
  }
}
// Start the server
const server = new HTTPServer();
server.start();
