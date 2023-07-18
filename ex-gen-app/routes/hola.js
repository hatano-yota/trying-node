const express = require("express");
const router = express.Router();
const http = require("https");
const parseString = require("xml2js").parseString;

router.get("/", (req, res, next) => {
  const opt = {
    host: "news.google.com",
    port: 443,
    path: "/rss?hl=ja&ie=UTF-8&oe=UTF-8&gl=JP&ceid=JP:ja",
  };
  http.get(opt, (res2) => {
    let body = "";
    res2.on("data", (data) => {
      body += data;
    });
    res2.on("end", () => {
      parseString(body.trim(), (err, result) => {
        console.log(result);
        let data = {
          title: "Google News",
          content: result.rss.channel[0].item,
        };
        res.render("hola", data);
      });
    });
  });
});

module.exports = router;
