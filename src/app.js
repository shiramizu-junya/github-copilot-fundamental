const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const todoRoutes = require('./routes/todoRoutes');

const app = express();
const PORT = 3000;

// EJSをビューエンジンとして設定
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ミドルウェア設定
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// ルーティング設定
app.use('/', todoRoutes);

// サーバー起動
app.listen(PORT, () => {
  console.log(`ToDoアプリがポート${PORT}で起動しました`);
  console.log(`http://localhost:${PORT} にアクセスしてください`);
});

module.exports = app;
