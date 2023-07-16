const http = require("http");
const fs = require("fs");
const url = require("url");
const qs = require("querystring");
const ejs = require("ejs");

const index_page = fs.readFileSync("./index.ejs", "utf-8");
const other_page = fs.readFileSync("./other.ejs", "utf-8");
const style_css = fs.readFileSync("./style.css", "utf-8");

const data = {
  Taro: "09-999-999",
  Hanako: "080-889-889",
  Sachiko: "070-765-456",
  Ichiro: "070-333-444",
};

const data2 = {
  Taro: ["taro@yamada", "09-999-999", "Tokyo"],
  Hanako: ["hanako@flower", "080-889-998", "Yokohama"],
  Sachiko: ["sachi@happy", "080-765-456", "Fukuoka"],
  Ichiro: ["ichiro@unbreakable", "070-333-444", "USA"],
};

const getFromClient = (req, res) => {
  const url_parts = url.parse(req.url, true);
  switch (url_parts.pathname) {
    case "/":
      response_index(req, res);
      break;
    case "/other":
      response_other(req, res);
      break;
    case "/style.css":
      res.writeHead(200, { "Content-Type": "text/css" });
      res.write(style_css);
      res.end();
      break;
    default:
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("no page...");
      break;
  }
};

const response_index = (req, res) => {
  const msg = "これはIndexページです。";
  const content = ejs.render(index_page, {
    title: "index_page",
    content: msg,
    data: data,
    filename: "data_item",
  });
  res.writeHead(200, { "Content-type": "text/html" });
  res.write(content);
  res.end();
};

const response_other = (req, res) => {
  let msg = "これはOtherページです。";
  const content = ejs.render(other_page, {
    title: "Other",
    content: msg,
    data: data2,
    filename: "data_item",
  });
  res.writeHead(200, { "Content-Type": "text/html" });
  res.write(content);
  res.end();
};

const server = http.createServer(getFromClient);
server.listen(4410);
console.log("Server start!");
