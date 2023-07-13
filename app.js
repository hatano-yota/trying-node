const http = require("http");
const fs = require("fs");
const url = require("url");
const ejs = require("ejs");

const index_page = fs.readFileSync("./index.ejs", "utf-8");
const other_page = fs.readFileSync("./other.ejs", "utf-8");
const style_css = fs.readFileSync("./style.css", "utf-8");

const getFromClient = (req, res) => {
  const url_parts = url.parse(req.url);
  switch (url_parts.pathname) {
    case "/":
      const index_content = ejs.render(index_page, {
        title: "Indexページ",
        content: "これはテンプレートを使用したサンプルページです。",
      });
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(index_content);
      res.end();
      break;
    case "/style.css":
      res.writeHead(200, { "Content-Type": "text/css" });
      res.write(style_css);
      res.end();
      break;
    case "/other":
      const other_content = ejs.render(other_page, {
        title: "Other",
        content: "これはアザーページです。よろしく。",
      });
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(other_content);
      res.end();
      break;
    default:
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("no page...");
      break;
  }
};

const server = http.createServer(getFromClient);
server.listen(4410);
console.log("Server start!");
