const express = require('express');
const router = express.Router();
const TodoController = require('../controllers/TodoController');
const { requireAuth } = require('../middleware/authMiddleware');

// ToDoリストページを表示
router.get('/', requireAuth, (req, res) => {
  const controller = new TodoController();
  controller.getAllTodos((err, todos) => {
    if (err) {
      res.status(500).send('データベースエラー');
    } else {
      res.render('index', { todos, user: req.user });
    }
  });
});

// ToDo作成フォームを表示
router.get('/new', requireAuth, (req, res) => {
  res.render('new');
});

// ToDoを作成
router.post('/create', requireAuth, (req, res) => {
  const { title, content, deadline, priority } = req.body;
  const controller = new TodoController();
  controller.createTodo(title, content, deadline, priority, (err, result) => {
    if (err) {
      res.status(500).send('ToDo作成エラー');
    } else {
      res.redirect('/');
    }
  });
});

// ToDo編集フォームを表示
router.get('/edit/:id', requireAuth, (req, res) => {
  const controller = new TodoController();
  controller.getTodoById(req.params.id, (err, todo) => {
    if (err) {
      res.status(500).send('データベースエラー');
    } else if (!todo) {
      res.status(404).send('ToDoが見つかりません');
    } else {
      res.render('edit', { todo });
    }
  });
});

// ToDoを更新
router.post('/update/:id', requireAuth, (req, res) => {
  const { title, content, deadline, priority } = req.body;
  const controller = new TodoController();
  controller.updateTodo(req.params.id, title, content, deadline, priority, (err, result) => {
    if (err) {
      res.status(500).send('ToDo更新エラー');
    } else {
      res.redirect('/');
    }
  });
});

// ToDoを削除
router.post('/delete/:id', requireAuth, (req, res) => {
  const controller = new TodoController();
  controller.deleteTodo(req.params.id, (err, result) => {
    if (err) {
      res.status(500).send('ToDo削除エラー');
    } else {
      res.redirect('/');
    }
  });
});

module.exports = router;
