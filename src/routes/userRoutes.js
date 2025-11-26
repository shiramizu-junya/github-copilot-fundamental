const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// ユーザーを作成するルート
router.post('/users', userController.createUser);

// 指定されたIDのユーザー情報を取得するルート
router.get('/users/:id', userController.getUser);

// 指定されたIDのユーザー情報を更新するルート
router.put('/users/:id', userController.updateUser);

// 指定されたIDのユーザー情報を削除するルート
router.delete('/users/:id', userController.deleteUser);

module.exports = router;