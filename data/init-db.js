const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'todos.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  // usersテーブル作成
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('usersテーブル作成エラー:', err);
    } else {
      console.log('usersテーブルが正常に作成されました');
    }
  });

  // todosテーブル作成
  db.run(`
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      content TEXT,
      deadline TEXT,
      priority TEXT CHECK(priority IN ('低', '中', '高')) DEFAULT '中',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `, (err) => {
    if (err) {
      console.error('todosテーブル作成エラー:', err);
    } else {
      console.log('todosテーブルが正常に作成されました');
    }
  });
});

db.close();
