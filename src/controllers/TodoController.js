const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class TodoController {
  constructor() {
    const dbPath = path.join(__dirname, '../../data/todos.db');
    this.db = new sqlite3.Database(dbPath);
  }

  // ToDoリストを取得
  getAllTodos(userId, callback) {
    const sql = `
      SELECT * FROM todos 
      WHERE user_id = ?
      ORDER BY deadline ASC, 
        CASE priority 
          WHEN '高' THEN 1 
          WHEN '中' THEN 2 
          WHEN '低' THEN 3 
          ELSE 4 
        END ASC
    `;
    this.db.all(sql, [userId], (err, rows) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, rows);
      }
    });
  }

  // 特定のToDoを取得
  getTodoById(id, userId, callback) {
    const sql = 'SELECT * FROM todos WHERE id = ? AND user_id = ?';
    this.db.get(sql, [id, userId], (err, row) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, row);
      }
    });
  }

  // ToDoを作成
  createTodo(userId, title, content, deadline, priority, callback) {
    const sql = 'INSERT INTO todos (user_id, title, content, deadline, priority) VALUES (?, ?, ?, ?, ?)';
    this.db.run(sql, [userId, title, content, deadline, priority], function(err) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, { id: this.lastID });
      }
    });
  }

  // ToDoを更新
  updateTodo(id, userId, title, content, deadline, priority, callback) {
    const sql = `
      UPDATE todos 
      SET title = ?, content = ?, deadline = ?, priority = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND user_id = ?
    `;
    this.db.run(sql, [title, content, deadline, priority, id, userId], function(err) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, { changes: this.changes });
      }
    });
  }

  // ToDoを削除
  deleteTodo(id, userId, callback) {
    const sql = 'DELETE FROM todos WHERE id = ? AND user_id = ?';
    this.db.run(sql, [id, userId], function(err) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, { changes: this.changes });
      }
    });
  }

  // データベース接続をクローズ
  close() {
    this.db.close();
  }
}

module.exports = TodoController;
