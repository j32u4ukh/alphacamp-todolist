const express = require("express");
const { engine } = require("express-handlebars");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");

// 引用路由器
const router = require("./routes");

// 載入中間件
const messageHandler = require("./middlewares/message-handler");
const errorHandler = require("./middlewares/error-handler");

// NOTE: Powershell 設置環境變數指令 ```$env:VariableName = "VariableValue"```
if (process.env.NODE_ENV === "development") {
  require("dotenv").config();
}

const app = express();
const port = 3000;

// 設定 extname: '.hbs'，是指定副檔名為 .hbs，有了這行以後，我們才能把預設的長檔名改寫成短檔名。
app.engine(".hbs", engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");
app.set("views", "./views");
app.use(express.static("public"));

// 需要使用 express.urlencoded 來從請求網址中獲取表單資料，否則就會回傳 undefined
app.use(express.urlencoded({ extended: true }));

// 取得 body 中的 json 數據
// app.use(express.json());

// 「覆寫 (override)」HTTP 方法，允許表單傳送 GET 和 POST 以外的方法
app.use(methodOverride("_method"));

// secret：為了保護 session 放到瀏覽器的 cookie 後不會被篡改與偽造，這個參數是 session 用來驗證 session id 的字串，這組字串會由伺服器設定，不會洩露給用戶端。
// 下面兩個設定項沒有設置也能正常運行，只是會在 server 上跳出一些提示訊息，建議還是把它設定起來。
// resave：當設定為 true 時，會在每一次與使用者互動後，強制把 session 更新到 session store 裡。
// saveUninitialized：強制將未初始化的 session 存回 session store。未初始化表示這個 session 是新的而且沒有被修改過，例如未登入的使用者的 session。
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());

app.use(passport.initialize());

app.use(messageHandler);

// 將 request 導入路由器
app.use(router);

// 錯誤處理
app.use(errorHandler);

app.listen(port, () => {
  console.log(`express server is running on http://localhost:${port}`);
});
