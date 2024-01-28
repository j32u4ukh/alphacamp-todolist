const express = require("express");
const db = require("../models");
const bcrypt = require("bcryptjs");
const router = express.Router();
const User = db.User;

router.post("/", async (req, res, next) => {
  const { email, name, password, confirm } = req.body;
  if (email === "") {
    next({ errorMessage: "email 為必填欄位" });
    return;
  }
  if (password === "") {
    next({ errorMessage: "password 為必填欄位" });
    return;
  }
  if (password !== confirm) {
    next({ errorMessage: "Password 和 Confirm password 不相同" });
    return;
  }
  // TODO: User.Count 無須實際取出 User 數據，計算筆數即可
  return User.count({
    where: { email },
  })
    .then((count) => {
      if (count > 0) {
        next({ errorMessage: "email 已註冊" });
        return;
      }

      return bcrypt
        .hash(password, 10)
        .then((hash) => {
          User.create({
            name,
            email,
            password: hash,
          })
            .then(() => {
              req.flash("success", "註冊成功!");
              res.redirect("/login");
            })
            .catch((error) => {
              error.errorMessage = "註冊失敗:(";
              next(error);
            });
        })
        .catch((error) => {
          error.errorMessage = "註冊失敗:(";
          next(error);
        });
    })
    .catch((error) => {
      next({ errorMessage: `讀取用戶數據時發生錯誤, error: ${error}` });
      return;
    });
});

module.exports = router;
