const express = require("express");
const db = require("../models");
const router = express.Router();
const Todo = db.Todo;

router.get("/", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const userId = req.user.id;

  return Todo.findAll({
    attributes: ["id", "name", "isComplete"],
    where: { userId },
    offset: (page - 1) * limit,
    limit,
    raw: true,
  })
    .then((todos) => {
      res.render("todos", {
        todos,
        prev: page > 1 ? page - 1 : page,
        next: page + 1,
        page,
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
    const userId = req.user.id;

    Todo.create({ name, userId })
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
  const userId = req.user.id;

  return Todo.findByPk(id, {
    attributes: ["id", "name", "isComplete", "userId"],
    raw: true,
  })
    .then((todo) => {
      if (!todo) {
        req.flash("error", "資料不存在");
        return res.redirect("/todos");
      }
      if (todo.userId !== userId) {
        req.flash("error", "權限不足");
        return res.redirect("/todos");
      }
      res.render("todo", { todo });
    })
    .catch((error) => {
      error.errorMessage = "查看特定 todo 失敗!";
      next(error);
    });
});

router.put("/:id", (req, res, next) => {
  const { name, isComplete } = req.body;
  const id = req.params.id;
  const userId = req.user.id;

  return Todo.update(
    {
      name: name,
      isComplete: isComplete === "completed",
    },
    { where: { id, userId } }
  )
    .then((data) => {
      console.log(`data: ${JSON.stringify(data)}`);
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
  const userId = req.user.id;

  return Todo.destroy({
    where: { id, userId },
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
  const userId = req.user.id;

  return Todo.findByPk(id, {
    attributes: ["id", "name", "isComplete", "userId"],
    raw: true,
  })
    .then((todo) => {
      if (!todo) {
        req.flash("error", "資料不存在");
        return res.redirect("/todos");
      }
      if (todo.userId !== userId) {
        req.flash("error", "權限不足");
        return res.redirect("/todos");
      }
      res.render("edit", { todo });
    })
    .catch((error) => {
      error.errorMessage = "特定 todo 的編輯頁面取得失敗!";
      next(error);
    });
});

module.exports = router;
