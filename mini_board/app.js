const http = require("http");
const fs = require("fs");
const ejs = require("ejs");
const url = require("url");
const qs = require("querystring");

const index_page = fs.readFileSync("./index.ejs", "utf8");
const login_page = fs.readFileSync("./login.ejs", "utf8");

const max_num = 10;
const filename = "mydata.txt";
let message_data;

// createServerの処理
const getFromClient = (req, res) => {
  const url_parts = url.parse(req.url, true);
  switch (url_parts.pathname) {
    case "/": // トップページ(メッセージボード)
      response_index(req, res);
      break;

    case "/login": // ログインページ
      response_login(req, res);
      break;

    default:
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("no page...");
      break;
  }
};

// loginのアクセス処理
const response_login = (req, res) => {
  const content = ejs.render(login_page, {});
  res.writeHead(200, { "Content-Type": "text/html" });
  res.write(content);
  res.end();
};

// indexのアクセス処理
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
      data = qs.parse(body);
      addToData(data.id, data.msg, filename, req);
      write_index(req, res);
    });
  } else {
    write_index(req, res);
  }
};

// indexページの作成
const write_index = (req, res) => {
  const msg = "※何かメッセージを書いてください。";
  const content = ejs.render(index_page, {
    title: "Index",
    content: msg,
    data: message_data,
    filename: "data_item",
  });
  res.writeHead(200, { "Content-Type": "text/html" });
  res.write(content);
  res.end();
};

// テキストファイルをロード
const readFromFile = (fname) => {
  fs.readFile(fname, "utf-8", (err, data) => {
    message_data = data.split("¥n");
  });
};

// データを更新
const addToData = (id, msg, fname, req) => {
  const obj = { id: id, msg: msg };
  const obj_str = JSON.stringify(obj);
  console.log(`add data: ${obj_str}`);
  message_data.unshift(obj_str);
  if (message_data > max_num) {
    message_data.pop();
  }
  saveToFile(fname);
};

// データを保存
const saveToFile = (fname) => {
  const data_str = message_data.join("¥n");
  fs.writeFile(fname, data_str, (err) => {
    if (err) {
      throw err;
    }
  });
};

// メインプログラム
readFromFile(filename);

let server = http.createServer(getFromClient);

server.listen(3000);
console.log("Server start!");
