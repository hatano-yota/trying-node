const http = require("http");
const fs = require("fs");
const url = require("url");
const ejs = require("ejs");

const index_page = fs.readFileSync("./index.ejs", "utf-8");
const other_page = fs.readFileSync("./other.ejs", "utf-8");
const style_css = fs.readFileSync("./style.css", "utf-8");

const getFromClient = (req, res) => {
  const url_parts = url.parse(req.url, true);
  let content;
  let query;
  switch (url_parts.pathname) {
    case "/":
      content = "これはテンプレートをindexページです。";
      query = url_parts.query;
      if (query.msg !== undefined) {
        content += "あなたは、「" + query.msg + "」と送りました";
      }
      content = ejs.render(index_page, {
        title: "Index",
        content: content,
      });
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(content);
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
