const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  let msg = "※何か書いて送信してください。";
  if (req.session.message !== undefined) {
    msg = `Last Message: ${req.session.message}`;
  }
  const data = {
    title: "Message Log!",
    content: msg,
  };
  res.render("message-log", data);
});

router.post("/post", (req, res, next) => {
  const msg = req.body["message"];
  req.session.message = msg;
  const data = {
    title: "Message Log!",
    content: `LAST MESSAGE: ${req.session.message}`,
  };
  res.render("message-log", data);
});

module.exports = router;
