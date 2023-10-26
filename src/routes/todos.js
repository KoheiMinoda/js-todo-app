
const express = require('express');
const passport = require('passport');
const Todo = require('../models/Todo');
const router = express.Router();

// すべてのToDoアイテムを取得
router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user.id });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 新しいToDoアイテムを作成
router.post('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const newTodo = new Todo({
    user: req.user.id,
    text: req.body.text,
  });
  try {
    const savedTodo = await newTodo.save();
    res.status(201).json(savedTodo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 特定のToDoアイテムを取得
router.get('/:id', passport.authenticate('jwt', { session: false }), getTodo, (req, res) => {
  res.json(res.todo);
});

// ToDoアイテムを更新
router.put('/:id', passport.authenticate('jwt', { session: false }), getTodo, async (req, res) => {
  if (req.body.text != null) {
    res.todo.text = req.body.text;
  }
  if (req.body.completed != null) {
    res.todo.completed = req.body.completed;
  }
  try {
    const updatedTodo = await res.todo.save();
    res.json(updatedTodo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ToDoアイテムを削除
router.delete('/:id', passport.authenticate('jwt', { session: false }), getTodo, async (req, res) => {
  try {
    await res.todo.remove();
    res.json({ message: 'Deleted Todo' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ミドルウェア: IDに基づいてToDoを検索し、それをres.todoに格納
async function getTodo(req, res, next) {
  let todo;
  try {
    todo = await Todo.findById(req.params.id);
    if (todo == null) {
      return res.status(404).json({ message: 'Cannot find todo' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.todo = todo;
  next();
}

module.exports = router;

