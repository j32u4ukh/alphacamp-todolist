// 引用 Express 與 Express 路由器
const express = require("express");
const router = express.Router();

// 準備引入路由模組
const todos = require("./todos");

router.use("/todos", todos);

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/login", (req, res) => {
  res.render("login");
});

// 匯出路由器
module.exports = router;
