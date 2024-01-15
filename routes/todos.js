const express = require("express");
const db = require("../models");
const router = express.Router();
const Todo = db.Todo;

router.get("/", (req, res) => {
  return Todo.findAll({
    attributes: ["id", "name", "is_complete"],
    raw: true,
  })
    .then((todos) => {
      res.render("todos", {
        todos,
      });
    })
    .catch((error) => {
      res.status(422).json(error);
    });
});

router.post("/", (req, res, next) => {
  const name = req.body.name;

  if (name === "") {
    req.flash("error", "name 為必填欄位");
    res.redirect("back");
  } else {
    Todo.create({ name })
      .then(() => {
        req.flash("success", "新增成功!");
        res.redirect("/todos");
      })
      .catch((error) => {
        error.errorMessage = "新增失敗:(";
        next(error);
      });
  }
});

router.get("/new", (req, res) => {
  return res.render("new");
});

router.get("/:id", (req, res, next) => {
  const id = req.params.id;

  return Todo.findByPk(id, {
    attributes: ["id", "name", "is_complete"],
    raw: true,
  })
    .then((todo) => {
      console.log(`todo: ${JSON.stringify(todo)}`);
      res.render("todo", { todo });
    })
    .catch((error) => {
      error.errorMessage = "查看特定 todo 失敗!";
      next(error);
    });
});

router.put("/:id", (req, res, next) => {
  const { name, is_complete } = req.body;
  const id = req.params.id;

  return Todo.update(
    {
      name: name,
      is_complete: is_complete === "completed",
    },
    { where: { id } }
  )
    .then(() => {
      req.flash("success", "更新成功!");
      res.redirect(`/todos/${id}`);
    })
    .catch((error) => {
      error.errorMessage = "更新失敗!";
      next(error);
    });
});

router.delete("/:id", (req, res) => {
  const id = req.params.id;
  return Todo.destroy({
    where: { id },
  })
    .then(() => {
      req.flash("success", "刪除成功!");
      res.redirect("/todos");
    })
    .catch((error) => {
      error.errorMessage = "刪除失敗!";
      next(error);
    });
});

router.get("/:id/edit", (req, res) => {
  const id = req.params.id;

  return Todo.findByPk(id, {
    attributes: ["id", "name", "is_complete"],
    raw: true,
  })
    .then((todo) => {
      res.render("edit", { todo });
    })
    .catch((error) => {
      error.errorMessage = "特定 todo 的編輯頁面取得失敗!";
      next(error);
    });
});

module.exports = router;
