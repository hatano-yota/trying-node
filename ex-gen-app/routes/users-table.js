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
      (err, row) => {
        if (!err) {
          rows += `<tr><th>${row.id}</th><td>${row.name}</td></tr>`;
        }
      },
      (err, count) => {
        if (!err) {
          const data = {
            title: "Users Table!",
            content: rows, // 取得したレコードデータ
          };
          res.render("users-table", data);
        }
      },
    );
  });
});

module.exports = router;
