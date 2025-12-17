const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class TodoController {
  constructor() {
    const dbPath = path.join(__dirname, '../../data/todos.db');
    this.db = new sqlite3.Database(dbPath);
  }

  // ToDoリストを取得
  getAllTodos(callback) {
    const sql = `
      SELECT * FROM todos 
      ORDER BY deadline ASC, 
        CASE priority 
          WHEN '高' THEN 1 
          WHEN '中' THEN 2 
          WHEN '低' THEN 3 
          ELSE 4 
        END ASC
    `;
    this.db.all(sql, [], (err, rows) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, rows);
      }
    });
  }

  // 特定のToDoを取得
  getTodoById(id, callback) {
    const sql = 'SELECT * FROM todos WHERE id = ?';
    this.db.get(sql, [id], (err, row) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, row);
      }
    });
  }

  // ToDoを作成
  createTodo(title, content, deadline, priority, callback) {
    const sql = 'INSERT INTO todos (title, content, deadline, priority) VALUES (?, ?, ?, ?)';
    this.db.run(sql, [title, content, deadline, priority], function(err) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, { id: this.lastID });
      }
    });
  }

  // ToDoを更新
  updateTodo(id, title, content, deadline, priority, callback) {
    const sql = `
      UPDATE todos 
      SET title = ?, content = ?, deadline = ?, priority = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    this.db.run(sql, [title, content, deadline, priority, id], function(err) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, { changes: this.changes });
      }
    });
  }

  // ToDoを削除
  deleteTodo(id, callback) {
    const sql = 'DELETE FROM todos WHERE id = ?';
    this.db.run(sql, [id], function(err) {
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
