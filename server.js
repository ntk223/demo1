// Static file server ~20 dòng — CHỈ phục vụ file tĩnh, không phải backend ứng dụng.
// Chạy demo: node server.js → mở http://localhost:3000

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = __dirname;
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
};

http
  .createServer((req, res) => {
    const filePath = path.join(ROOT, req.url === '/' ? 'index.html' : req.url);
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        return res.end('Not Found');
      }
      res.writeHead(200, { 'Content-Type': MIME[path.extname(filePath)] || 'application/octet-stream' });
      res.end(data);
    });
  })
  .listen(process.env.PORT || 3000, () =>
    console.log(`▶ Demo: http://localhost:${process.env.PORT || 3000}`)
  );
