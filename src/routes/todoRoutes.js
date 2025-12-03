const express = require('express');
const router = express.Router();
const TodoController = require('../controllers/TodoController');

const todoController = new TodoController();

// ToDo一覧
router.get('/', (req, res) => todoController.index(req, res));

// ToDo作成フォーム
router.get('/todos/new', (req, res) => todoController.new(req, res));

// ToDo作成処理
router.post('/todos', (req, res) => todoController.create(req, res));

// ToDo編集フォーム
router.get('/todos/:id/edit', (req, res) => todoController.edit(req, res));

// ToDo更新処理
router.post('/todos/:id', (req, res) => todoController.update(req, res));

// ToDo削除処理
router.post('/todos/:id/delete', (req, res) => todoController.delete(req, res));

module.exports = router;
