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
        success_message: req.flash("success"),
        error_message: req.flash("error"),
      });
    })
    .catch((err) => {
      res.status(422).json(err);
    });
});

router.post("/", (req, res) => {
  try {
    const name = req.body.name;

    if (name === "") {
      req.flash("error", "name 為必填欄位");
    } else {
      Todo.create({ name })
        .then(() => {
          req.flash("success", "新增成功!");
        })
        .catch((err) => {
          req.flash("error", "新增失敗!");
          console.log(err);
        });
    }
  } catch (error) {
    req.flash("error", "新增失敗!");
    console.log(err);
  } finally {
    res.redirect("/todos");
  }
});

router.get("/new", (req, res) => {
  return res.render("new");
});

router.get("/:id", (req, res) => {
  try {
    const id = req.params.id;

    return Todo.findByPk(id, {
      attributes: ["id", "name", "is_complete"],
      raw: true,
    })
      .then((todo) => {
        console.log(`todo: ${JSON.stringify(todo)}`);
        res.render("todo", { todo });
      })
      .catch((err) => {
        console.log(err);
        res.redirect("/todos");
      });
  } catch (error) {
    req.flash("error", "查看特定 todo 失敗!");
    console.log(err);
    res.redirect("/todos");
  }
});

router.put("/:id", (req, res) => {
  try {
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
      })
      .catch((err) => {
        req.flash("error", "更新失敗!");
        console.log(err);
      })
      .finally(() => {
        res.redirect(`/todos/${id}`);
      });
  } catch (error) {
    req.flash("error", "更新失敗!");
    console.log(err);
    res.redirect("/todos");
  }
});

router.delete("/:id", (req, res) => {
  try {
    const id = req.params.id;
    Todo.destroy({
      where: { id },
    })
      .then(() => {
        req.flash("success", "刪除成功!");
      })
      .catch((err) => {
        req.flash("error", "刪除失敗!");
        console.log(err);
      });
  } catch (error) {
    req.flash("error", "刪除失敗!");
    console.log(err);
  } finally {
    res.redirect("/todos");
  }
});

router.get("/:id/edit", (req, res) => {
  const id = req.params.id;

  return Todo.findByPk(id, {
    attributes: ["id", "name", "is_complete"],
    raw: true,
  }).then((todo) => {
    res.render("edit", { todo });
  });
});

module.exports = router;
