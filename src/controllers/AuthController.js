const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class AuthController {
  constructor() {
    const dbPath = path.join(__dirname, '../../data/todos.db');
    this.db = new sqlite3.Database(dbPath);
    // JWT secret key - in production, this should be an environment variable
    this.jwtSecret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
    this.jwtExpiration = '7d'; // 1週間
  }

  // ユーザー登録
  register(username, email, password, callback) {
    // パスワードのハッシュ化
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        return callback(err, null);
      }

      const sql = 'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)';
      this.db.run(sql, [username, email, hash], function(err) {
        if (err) {
          // UNIQUE制約違反のチェック
          if (err.message.includes('UNIQUE')) {
            return callback(new Error('ユーザー名またはメールアドレスは既に使用されています'), null);
          }
          return callback(err, null);
        }
        callback(null, { id: this.lastID, username, email });
      });
    });
  }

  // ログイン
  login(username, password, callback) {
    const sql = 'SELECT * FROM users WHERE username = ?';
    this.db.get(sql, [username], (err, user) => {
      if (err) {
        return callback(err, null);
      }
      if (!user) {
        return callback(new Error('ユーザー名またはパスワードが正しくありません'), null);
      }

      // パスワード検証
      bcrypt.compare(password, user.password_hash, (err, isMatch) => {
        if (err) {
          return callback(err, null);
        }
        if (!isMatch) {
          return callback(new Error('ユーザー名またはパスワードが正しくありません'), null);
        }

        // JWTトークン生成
        const token = jwt.sign(
          { id: user.id, username: user.username },
          this.jwtSecret,
          { expiresIn: this.jwtExpiration }
        );

        callback(null, { token, user: { id: user.id, username: user.username, email: user.email } });
      });
    });
  }

  // トークン検証
  verifyToken(token, callback) {
    jwt.verify(token, this.jwtSecret, (err, decoded) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, decoded);
    });
  }

  // ユーザーIDでユーザー取得
  getUserById(id, callback) {
    const sql = 'SELECT id, username, email, created_at FROM users WHERE id = ?';
    this.db.get(sql, [id], (err, user) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, user);
      }
    });
  }

  // データベース接続をクローズ
  close() {
    this.db.close();
  }
}

module.exports = AuthController;
