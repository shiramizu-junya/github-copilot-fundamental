const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const AuthController = require('../controllers/AuthController');
const { redirectIfAuthenticated } = require('../middleware/authMiddleware');

// レート制限設定
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分
  max: 5, // 15分間に5回まで
  message: 'リクエストが多すぎます。しばらくしてから再度お試しください。',
  standardHeaders: true,
  legacyHeaders: false,
});

// ユーザー登録フォームを表示
router.get('/register', redirectIfAuthenticated, (req, res) => {
  res.render('register', { error: null });
});

// ユーザー登録処理
router.post('/register', authLimiter, (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  // バリデーション
  if (!username || !email || !password) {
    return res.render('register', { error: '全ての項目を入力してください' });
  }

  if (password !== confirmPassword) {
    return res.render('register', { error: 'パスワードが一致しません' });
  }

  if (password.length < 6) {
    return res.render('register', { error: 'パスワードは6文字以上で入力してください' });
  }

  const controller = new AuthController();
  controller.register(username, email, password, (err, result) => {
    if (err) {
      return res.render('register', { error: err.message });
    }
    res.redirect('/login?registered=true');
  });
});

// ログインフォームを表示
router.get('/login', redirectIfAuthenticated, (req, res) => {
  const registered = req.query.registered === 'true';
  res.render('login', { error: null, success: registered ? '登録が完了しました。ログインしてください。' : null });
});

// ログイン処理
router.post('/login', authLimiter, (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.render('login', { error: 'ユーザー名とパスワードを入力してください', success: null });
  }

  const controller = new AuthController();
  controller.login(username, password, (err, result) => {
    if (err) {
      return res.render('login', { error: err.message, success: null });
    }

    // JWTトークンをCookieに保存（1週間有効）
    res.cookie('token', result.token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1週間
      sameSite: 'strict'
    });

    res.redirect('/');
  });
});

// ログアウト処理
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/login');
});

module.exports = router;
