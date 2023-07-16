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
      setCookie("msg", data.msg, res); // クッキーの保存
      write_index(req, res);
    });
  } else {
    write_index(req, res);
  }
};

// indexページの作成
const write_index = (req, res) => {
  const msg = "※伝言を表示します。";
  const cookie_data = getCookie("msg", req);
  const content = ejs.render(index_page, {
    title: "Index",
    content: msg,
    data: data,
    cookie_data: cookie_data,
  });
  res.writeHead(200, { "Content-type": "text/html" });
  res.write(content);
  res.end();
};

// クッキーの値を設定
const setCookie = (key, value, res) => {
  let cookie = escape(value);
  res.setHeader("Set-Cookie", [key + "=" + cookie]);
};

// クッキーの値を取得
const getCookie = (key, req) => {
  const cookie_data = req.headers.cookie !== undefined ? req.headers.cookie : "";
  const data = cookie_data.split(";");
  for (let i in data) {
    if (data[i].trim().startsWith(key + "=")) {
      const result = data[i].trim().substring(key.length + 1);
      return unescape(result);
    }
  }
  return "";
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
