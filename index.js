const express = require("express");
const { engine } = require("express-handlebars");
const methodOverride = require("method-override");
const app = express();
const port = 3000;
const db = require("./models");
const Todo = db.Todo;

// 設定 extname: '.hbs'，是指定副檔名為 .hbs，有了這行以後，我們才能把預設的長檔名改寫成短檔名。
app.engine(".hbs", engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");
app.set("views", "./views");
app.use(express.static("public"));

// 需要使用 express.urlencoded 來從請求網址中獲取表單資料，否則就會回傳 undefined
app.use(express.urlencoded({ extended: true }));

// 「覆寫 (override)」HTTP 方法，允許表單傳送 GET 和 POST 以外的方法
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/todos", (req, res) => {
  return Todo.findAll({
    attributes: ["id", "name"],
    raw: true,
  })
    .then((todos) => {
      // res.send({ todos });
      res.render("todos", { todos });
    })
    .catch((err) => {
      res.status(422).json(err);
    });
});

app.post("/todos", (req, res) => {
  const name = req.body.name;

  return Todo.create({ name })
    .then(() => {
      res.redirect("/todos");
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/todos/new", (req, res) => {
  return res.render("new");
});

app.get("/todos/:id", (req, res) => {
  const id = req.params.id;

  return Todo.findByPk(id, {
    attributes: ["id", "name"],
    raw: true,
  })
    .then((todo) => {
      res.render("todo", { todo });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.put("/todos/:id", (req, res) => {
  const body = req.body;
  const id = req.params.id;

  return Todo.update({ name: body.name }, { where: { id } }).then(() => {
    res.redirect(`/todos/${id}`);
  });
});

app.delete("/todos/:id", (req, res) => {
  res.send(`delete todo: ${req.params.id}`);
});

app.get("/todos/:id/edit", (req, res) => {
  const id = req.params.id;

  return Todo.findByPk(id, {
    attributes: ["id", "name"],
    raw: true,
  }).then((todo) => {
    res.render("edit", { todo });
  });
});

app.listen(port, () => {
  console.log(`express server is running on http://localhost:${port}`);
});
