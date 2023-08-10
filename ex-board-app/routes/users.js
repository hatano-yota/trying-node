const express = require("express");
const router = express.Router();
const db = require("../models/index");
const { Op } = require("sequelize");

router.get("/", (req, res, next) => {
  const { id, nm, min, max } = req.query;
  const whereCondition = {
    ...(id ? { id: { [Op.lte]: id } } : {}),
    ...(nm ? { name: { [Op.like]: `%${nm}%` } } : {}),
    ...(min && max ? { age: { [Op.gte]: min * 1, [Op.lte]: max * 1 } } : {}),
  };
  db.User.findAll({ where: whereCondition }).then((users) => {
    const data = {
      title: "Users/Index",
      content: users,
    };
    res.render("users/index", data);
  });
});

router.get("/add", (req, res, next) => {
  const data = {
    title: "Users/Add",
    form: new db.User(),
    err: null,
  };
  res.render("users/add", data);
});

router.post("/add", (req, res, next) => {
  const form = {
    name: req.body.name,
    pass: req.body.pass,
    mail: req.body.mail,
    age: req.body.age,
  };
  db.sequelize
    .sync()
    .then(() => db.User.create(form))
    .then(() => {
      res.redirect("/users");
    })
    .catch((err) => {
      const data = {
        title: "Users/Add",
        form: form,
        err: err,
      };
      res.render("users/add", data);
    });
});

router.get("/edit", (req, res, next) => {
  db.User.findByPk(req.query.id).then((usr) => {
    const data = {
      title: "Users/Edit",
      form: usr,
    };
    res.render("users/edit", data);
  });
});

router.post("/edit", (req, res, next) => {
  db.User.findByPk(req.body.id).then((usr) => {
    usr.name = req.body.name;
    usr.pass = req.body.pass;
    usr.mail = req.body.mail;
    usr.age = req.body.age;
    usr.save().then(() => res.redirect("/users")); // モデルの保存 → リダイレクト
  });
});

router.get("/delete", (req, res, next) => {
  db.User.findByPk(req.query.id).then((usr) => {
    const data = {
      title: "Users/Delete",
      form: usr,
    };
    res.render("users/delete", data);
  });
});

router.post("/delete", (req, res, next) => {
  db.User.findByPk(req.body.id).then((usr) => {
    usr.destroy().then(() => res.redirect("/users"));
  });
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
      if (back === undefined) {
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
