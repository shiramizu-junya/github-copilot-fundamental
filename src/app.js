const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const todoRoutes = require('./routes/todoRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = 3000;

// EJSをビューエンジンとして設定
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ミドルウェア設定
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ルーティング設定
app.use('/', authRoutes);
app.use('/', todoRoutes);

// サーバー起動
app.listen(PORT, () => {
  console.log(`ToDoアプリがポート${PORT}で起動しました`);
  console.log(`http://localhost:${PORT} にアクセスしてください`);
});

module.exports = app;
