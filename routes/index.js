// 引用 Express 與 Express 路由器
const express = require("express");
const router = express.Router();
const passport = require("passport");
const LocalStrategy = require("passport-local");
const db = require("../models");
const User = db.User;

passport.use(
  new LocalStrategy({ usernameField: "email" }, (username, password, done) => {
    return User.findOne({
      attributes: ["id", "name", "email", "password"],
      where: { email: username },
      raw: true,
    })
      .then((user) => {
        if (!user || user.password !== password) {
          return done(null, false, { message: "email 或密碼錯誤" });
        }
        return done(null, user);
      })
      .catch((error) => {
        error.errorMessage = "登入失敗";
        done(error);
      });
  })
);

// 這段程式碼設定了 passport 的使用者 serialize（序列化邏輯）。當驗證成功後，它會將使用者物件中的重要屬性 id、name 和 email序列化後傳遞給 done 函式。
// 換句話說，他的作用在於要存什麼資料到 session 然後讓 passport 在登入流程中呼叫。
passport.serializeUser((user, done) => {
  const { id, name, email } = user;
  return done(null, { id, name, email });
});

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

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/todos",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

// 匯出路由器
module.exports = router;
