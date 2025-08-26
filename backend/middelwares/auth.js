const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.cookies?.auth; // ✅ 쿠키에서 토큰 추출
    console.log('Token from cookie:', token); // ✅ 디버깅용 로그
    if (!token) return res.status(401).json({ message: '인증 필요 (토큰 없음)' });

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = payload;
        next();
    } catch (error) {
        console.error('Token verification error:', error.message); // ✅ 디버깅용 로그
        return res.status(401).json({ message: '유효하지 않은 토큰' });
    }
};