const express = require('express');
const router = express.Router();

router.post('/guest', (req, res) => {
    // 게스트 토큰 또는 세션 생성 로직
    const guestToken = Math.random().toString(36).substring(2); // 간단한 토큰 예시
    console.log('Guest token generated:', guestToken); // ✅ 디버깅용 로그
    
    // ✅ 쿠키로 설정: 크로스 도메인 지원
    res.cookie('auth', guestToken, {
        httpOnly: true,
        secure: true, // ✅ HTTPS에서만 작동 (배포 시 true)
        sameSite: 'none', // ✅ 크로스 도메인 쿠키 허용
        maxAge: 3600000 // 1시간
    });
    res.status(200).json({ message: '게스트 로그인 성공' });
});

module.exports = router;