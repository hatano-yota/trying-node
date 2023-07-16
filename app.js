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
  // POSTアクセス処理
  if (req.method === "POST") {
    let body = "";
    // データ受信のイベント処理
    req.on("data", (data) => {
      body += data;
    });
    // データ受信終了のイベント処理
    req.on("end", () => {
      const post_data = qs.parse(body); // データのパース
      msg += "あなたは、「" + post_data.msg + "」と書きました。";
      const content = ejs.render(other_page, {
        title: "Other",
        content: msg,
      });
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(content);
      res.end();
    });
  } else {
    // GETアクセス処理
    msg = "ページがありません";
    const content = ejs.render(other_page, {
      title: "Other",
      content: msg,
    });
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write(content);
    res.end();
  }
};

const server = http.createServer(getFromClient);
server.listen(4410);
console.log("Server start!");
