const express = require("express");
const { engine } = require("express-handlebars");
const app = express();
const port = 3000;
const db = require("./models");
const Todo = db.Todo;

// 設定 extname: '.hbs'，是指定副檔名為 .hbs，有了這行以後，我們才能把預設的長檔名改寫成短檔名。
app.engine(".hbs", engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");
app.set("views", "./views");
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/todos", (req, res) => {
  return Todo.findAll()
    .then((todos) => {
      res.send({ todos });
    })
    .catch((err) => {
      res.status(422).json(err);
    });
});

app.post("/todos", (req, res) => {
  res.send("add todo");
});

app.get("/todos/:id", (req, res) => {
  res.send(`get todo: ${req.params.id}`);
});

app.put("/todos/:id", (req, res) => {
  res.send(`modify todo: ${req.params.id}`);
});

app.delete("/todos/:id", (req, res) => {
  res.send(`delete todo: ${req.params.id}`);
});

app.get("/todos/:id/edit", (req, res) => {
  res.send(`get todo edit: ${req.params.id}`);
});

app.get("/todos/new", (req, res) => {
  res.send("create todo");
});

app.listen(port, () => {
  console.log(`express server is running on http://localhost:${port}`);
});
