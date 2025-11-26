const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// ミドルウェアの設定
app.use(bodyParser.json());

// ルーティングの設定
app.use('/', userRoutes);

// エラーハンドリングミドルウェア
app.use(errorHandler);

// サーバーの起動
app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
