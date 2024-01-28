const passport = require("passport");
const LocalStrategy = require("passport-local");
const FacebookStrategy = require("passport-facebook");
const db = require("../models");
const bcrypt = require("bcryptjs");
const User = db.User;

passport.use(
  new LocalStrategy({ usernameField: "email" }, (username, password, done) => {
    return User.findOne({
      attributes: ["id", "name", "email", "password"],
      where: { email: username },
      raw: true,
    })
      .then((user) => {
        if (!user) {
          return done(null, false, { message: "email 或密碼錯誤" });
        }
        return bcrypt.compare(password, user.password).then((isMatch) => {
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: "email 或密碼錯誤" });
          }
        });
      })
      .catch((error) => {
        error.errorMessage = "登入失敗";
        done(error);
      });
  })
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      profileFields: ["email", "displayName"],
    },
    (accessToken, refreshToken, profile, done) => {
      const email = profile.emails[0].value;
      const name = profile.displayName;

      return User.findOne({
        attributes: ["id", "name", "email"],
        where: { email: email },
        raw: true,
      })
        .then((user) => {
          if (user) {
            return done(null, user);
          }
          const randomPwd = Math.random().toString(36).slice(-8);

          return bcrypt
            .hash(randomPwd, 10)
            .then((hash) => User.create({ name, email, password: hash }))
            .then((user) =>
              done(null, { id: user.id, name: user.name, email: user.email })
            );
        })
        .catch((error) => {
          error.errorMessage = "登入失敗";
          done(error);
        });
    }
  )
);

// 這段程式碼設定了 passport 的使用者 serialize（序列化邏輯）。當驗證成功後，它會將使用者物件中的重要屬性 id、name 和 email序列化後傳遞給 done 函式。
// 換句話說，他的作用在於要存什麼資料到 session 然後讓 passport 在登入流程中呼叫。
passport.serializeUser((user, done) => {
  const { id, name, email } = user;
  // 將 { id, name, email } 存入 session 供 passport 在驗證流程中取用，會再透過 deserializeUser 將 session 轉換回數據
  return done(null, { id, name, email });
});

// 設定 deserializeUser 用來從已序列化的使用者資料中還原原始的使用者物件，這個步驟可以讓我們在後續的驗證和使用中，不用透過 session 物件，也可以輕鬆提取使用者的相關資訊。
// 在使用 passport 進行驗證時，序列化（serialize）用於將使用者物件轉換成可儲存的格式（例如 session），而反序列化則是將儲存的格式轉換回原始的使用者物件。
passport.deserializeUser((user, done) => {
  done(null, { id: user.id });
});

module.exports = passport;
