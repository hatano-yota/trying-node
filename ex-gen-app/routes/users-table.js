const express = require("express");
const router = express.Router();

const sqlite3 = require("sqlite3");

// データベースオブジェクトの取得
const db = new sqlite3.Database("mydb.sqlite3");

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

router.get("/show", (req, res, next) => {
  const id = req.query.id;
  db.serialize(() => {
    const q = "select * from mydata where id = ?";
    db.get(q, [id], (err, row) => {
      if (!err) {
        const data = {
          title: "Users-table/show",
          content: `id = ${id} のレコード：`,
          mydata: row,
        };
        res.render("users-table/show", data);
      }
    });
  });
});

router.get("/edit", (req, res, next) => {
  const id = req.query.id;
  db.serialize(() => {
    const q = "select * from mydata where id = ?";
    db.get(q, [id], (err, row) => {
      if (!err) {
        const data = {
          title: "users-table/edit",
          content: `id = ${id} のレコードを編集：`,
          mydata: row,
        };
        res.render("users-table/edit", data);
      }
    });
  });
});

router.post("/edit", (req, res, next) => {
  const id = req.body.id;
  const nm = req.body.name;
  const ml = req.body.mail;
  const ag = req.body.age;
  const q = "update mydata set name = ?, mail = ?, age = ? where id = ?";
  db.serialize(() => {
    db.run(q, nm, ml, ag, id);
  });
  res.redirect("/users-table");
});

router.get("/delete", (req, res, next) => {
  const id = req.query.id;
  db.serialize(() => {
    const q = "select * from mydata where id = ?";
    db.get(q, [id], (err, row) => {
      if (!err) {
        const data = {
          title: "users-table/delete",
          content: `id = ${id} のレコードを削除`,
          mydata: row,
        };
        res.render("users-table/delete", data);
      }
    });
  });
});

router.post("/delete", (req, res, next) => {
  const id = req.body.id;
  db.serialize(() => {
    const q = "delete from mydata where id = ?";
    db.run(q, id);
  });
  res.redirect("/users-table");
});

router.get("/find", (req, res, next) => {
  db.serialize(() => {
    db.all("select * from mydata", (err, rows) => {
      if (!err) {
        const data = {
          title: "Users-table/find",
          find: "",
          content: "検索条件を入力してください",
          mydata: rows,
        };
        res.render("users-table/find", data);
      }
    });
  });
});

router.post("/find", (req, res, next) => {
  let find = req.body.find;
  db.serialize(() => {
    const q = "select * from mydata where ";
    db.all(q + find, [], (err, rows) => {
      if (!err) {
        const data = {
          title: "Users-table/find",
          find: find,
          content: `検索条件 ${find}`,
          mydata: rows,
        };
        res.render("users-table/find", data);
      }
    });
  });
});

module.exports = router;
