const express = require("express");
const router = express.Router();

const sqlite3 = require("sqlite3");

// データベースオブジェクトの取得
const db = new sqlite3.Database("mydb.sqlite3");

// GETアクセスの処理
router.get("/", (req, res, next) => {
  // データベースのシリアライズ
  db.serialize(() => {
    let rows = "";
    db.each(
      "select * from mydata",
      // レコードが取り出される毎に実行
      (err, row) => {
        if (!err) {
          rows += `<tr><th>${row.id}</th><td>${row.name}</td><td>${row.mail}</td><td>${row.age}</td></tr>`;
        }
      },
      // 全てのレコードを取り出し終わった後に実行
      (err, count) => {
        if (!err) {
          const data = {
            title: "Users Table!",
            content: rows, // 取得したレコードデータ
          };
          res.render("users-table/index", data);
        }
      },
    );
  });
});

router.get("/add", (req, res, next) => {
  const data = {
    title: "Hello/Add",
    content: "新しいレコードを入力：",
  };
  res.render("users-table/add", data);
});
router.post("/add", (req, res, next) => {
  const nm = req.body.name;
  const ml = req.body.mail;
  const ag = req.body.age;
  db.serialize(() => {
    db.run("insert into mydata (name, mail, age) values (?, ?, ?)", nm, ml, ag);
  });
  res.redirect("/users-table");
});

module.exports = router;
