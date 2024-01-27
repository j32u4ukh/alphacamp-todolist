const express = require("express");
const db = require("../models");
const router = express.Router();
const User = db.User;

router.post("/", async (req, res, next) => {
  const email = req.body.email;
  if (email === "") {
    next({ errorMessage: "email 為必填欄位" });
    return;
  }
  let user = await User.findOne({
    where: { email: email },
  });
  if (user) {
    next({ errorMessage: "email 已註冊" });
    return;
  }
  console.log(`email: ${email}`);
  const password = req.body.password;
  if (password === "") {
    next({ errorMessage: "password 為必填欄位" });
    return;
  }
  console.log(`password: ${password}`);
  const name = req.body.name;
  console.log(`name: ${name}`);
  User.create({
    name,
    email,
    password,
  })
    .then(() => {
      req.flash("success", "註冊成功!");
      res.redirect("/login");
    })
    .catch((error) => {
      error.errorMessage = "註冊失敗:(";
      next(error);
    });
});

module.exports = router;
