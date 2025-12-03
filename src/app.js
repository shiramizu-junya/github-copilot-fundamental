const express = require('express');
const path = require('path');
const todoRoutes = require('./routes/todoRoutes');
const db = require('../data/database');

const app = express();
const PORT = 3000;

// ミドルウェア設定
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ビューエンジン設定
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ルーティング
app.use('/', todoRoutes);

// データベース初期化後にサーバー起動
db.initDatabase()
	.then(() => {
		app.listen(PORT, () => {
			console.log(`サーバーが起動しました: http://localhost:${PORT}`);
		});
	})
	.catch((err) => {
		console.error('データベース初期化エラー:', err);
		process.exit(1);
	});
