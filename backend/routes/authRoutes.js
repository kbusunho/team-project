const router = require('express').Router();
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

router.post('/guest', (req, res) => {
    try {
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ message: '서버 설정 오류: JWT_SECRET 없음' });
        }

        const uid = req.body?.deviceId ? String(req.body.deviceId) : uuidv4();

        const token = jwt.sign(
            { uid, role: 'guest' },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.cookie('auth', token, {
            httpOnly: true,
            sameSite: 'none',
            secure: process.env.NODE_ENV === 'production', // ✅ 프로덕션일 때만 secure:true
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/',
        });

        return res.status(200).json({ message: '게스트 인증 완료', uid });
    } catch (err) {
        console.error('게스트 인증 오류:', err);
        return res.status(500).json({ message: '게스트 인증 중 서버 오류' });
    }
});

module.exports = router;
