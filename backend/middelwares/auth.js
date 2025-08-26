// backend/middlewares/auth.js
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.cookies?.auth;
  console.log('Token from cookie:', token);

  if (!token) return res.status(401).json({ message: '인증 필요 (토큰 없음)' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (error) {
    console.error('Token verification error:', error.message);
    return res.status(401).json({ message: '유효하지 않은 토큰' });
  }
};
