const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.cookies?.auth; // ✅ 쿠키에서 토큰 추출
    if (!token) return res.status(401).json({ message: '인증 필요 (토큰 없음)' });

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET); // ❌ 오타 있었음(playload → payload)
        req.user = payload;
        next();
    } catch (error) {
        return res.status(401).json({ message: '유효하지 않은 토큰' });
    }
};
