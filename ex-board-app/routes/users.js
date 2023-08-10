var express = require("express");
var router = express.Router();

router.get("/", function (req, res, next) {
  res.redirect("/boards/1");
});

router.get("/login", (req, res, next) => {
  const data = {
    title: "Users/Login",
    content: "名前とパスワードを入力ください",
  };
  res.render("users/login", data);
});

router.post("/login", (req, res, next) => {
  db.User.findOne({
    where: {
      name: req.body.name,
      pass: req.body.pass,
    },
  }).then((usr) => {
    if (usr !== null) {
      req.session.login = usr;
      let back = req.session.back;
      if (back === null) {
        back = "/";
      }
      res.redirect(back);
    } else {
      const data = {
        title: "Users/Login",
        content: "ユーザーが見つかりませんでした。名前とパスワードをご確認ください。",
      };
      res.render("users/login", data);
    }
  });
});

module.exports = router;
