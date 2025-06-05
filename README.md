
# 🔧 Simple TCP-based HTTP Server in Node.js

This project is a basic implementation of a custom HTTP server built using **Node.js `net` module** (TCP sockets) — with no use of the built-in `http` module. It demonstrates low-level handling of HTTP requests, routing based on HTTP methods, and serving static files from the local directory.

---

## 🚀 Features

- ✅ Built on raw TCP sockets using `net` module
- ✅ Parses HTTP GET requests
- ✅ Serves static files (like `.html`, `.txt`, etc.)
- ✅ Handles 404 Not Found and 501 Not Implemented errors
- ✅ Customizable response headers and status codes

---

## 📁 Project Structure

```
.
├── server.js        # Main server logic
├── index.html       # Sample HTML file to serve (create this manually)
├── README.md        # Project documentation
```

---

## 🧠 How It Works

- On startup, the server listens on `localhost:8080`
- When a client sends a request (e.g. `GET /index.html`), the server:
  - Parses the HTTP request line
  - Finds the appropriate handler (e.g. `handle_GET`)
  - Serves the requested file or returns an error page

---

## 🛠️ Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/yourusername/tcp-http-server.git
cd tcp-http-server
```

### 2. Create an HTML File (example)

```html
<!-- index.html -->
<!DOCTYPE html>
<html>
  <head><title>My TCP Server</title></head>
  <body><h1>Hello from TCP Server!</h1></body>
</html>
```

### 3. Run the Server

```bash
node server.js
```

### 4. Open in Browser or Use curl

```bash
http://localhost:8080/index.html
```

or

```bash
curl http://localhost:8080/index.html
```

---

## 🧪 Example Requests

- ✅ `GET /index.html` — serves the file if it exists
- ❌ `POST /` — returns 501 Not Implemented
- ❌ `GET /missing.html` — returns 404 Not Found

---

## 📚 Concepts Demonstrated

- Manual TCP socket handling
- HTTP request parsing (method, URI, version)
- Routing based on HTTP methods
- Basic file I/O using `fs`
- Constructing raw HTTP responses manually

---

## 🧩 To Do / Extend

- [ ] Add MIME type support
- [ ] Serve files from `/public` folder only
- [ ] Handle `POST`, `OPTIONS`, etc.
- [ ] Add support for query parameters
- [ ] Security: prevent directory traversal attacks

---

## 📝 License

MIT License

---

## 👨‍💻 Author

**Krishna Chaitanya**  
Feel free to contribute or open an issue!
