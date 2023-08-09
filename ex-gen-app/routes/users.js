const express = require("express");
const { Op } = require("sequelize");
const router = express.Router();
const db = require("../models/index");

/* GET users listing. */
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

module.exports = router;
