const AuthController = require('../controllers/AuthController');

// 認証が必要なルートを保護するミドルウェア
const requireAuth = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.redirect('/login');
  }

  const authController = new AuthController();
  authController.verifyToken(token, (err, decoded) => {
    if (err) {
      res.clearCookie('token');
      return res.redirect('/login');
    }

    // ユーザー情報をリクエストに追加
    req.user = decoded;
    next();
  });
};

// ログイン済みユーザーをリダイレクトするミドルウェア
const redirectIfAuthenticated = (req, res, next) => {
  const token = req.cookies.token;

  if (token) {
    const authController = new AuthController();
    authController.verifyToken(token, (err, decoded) => {
      if (!err) {
        return res.redirect('/');
      }
      next();
    });
  } else {
    next();
  }
};

module.exports = { requireAuth, redirectIfAuthenticated };
