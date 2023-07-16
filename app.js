const http = require("http");
const fs = require("fs");
const url = require("url");
const qs = require("querystring");
const ejs = require("ejs");

const index_page = fs.readFileSync("./index.ejs", "utf-8");
const other_page = fs.readFileSync("./other.ejs", "utf-8");
const style_css = fs.readFileSync("./style.css", "utf-8");

let data = { msg: "no message..." };

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
  // POSTアクセス時の処理
  if (req.method === "POST") {
    let body = "";
    // データ受信のイベント処理
    req.on("data", (data) => {
      body += data;
    });
    // データ受信終了のイベント処理
    req.on("end", () => {
      data = qs.parse(body); // データのパース
      write_index(req, res);
    });
  } else {
    write_index(req, res);
  }
};

// index の表示の作成
const write_index = (req, res) => {
  const msg = "※伝言を表示します。";
  const content = ejs.render(index_page, {
    title: "Index",
    content: msg,
    data: data,
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
    data: data,
    filename: "data_item",
  });
  res.writeHead(200, { "Content-Type": "text/html" });
  res.write(content);
  res.end();
};

const server = http.createServer(getFromClient);
server.listen(4410);
console.log("Server start!");
