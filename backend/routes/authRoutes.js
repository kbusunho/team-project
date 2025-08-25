const express = require('express');
const router = express.Router();

router.post('/guest', (req, res) => {
    // 게스트 토큰 또는 세션 생성 로직
    const guestToken = Math.random().toString(36).substring(2); // 간단한 토큰 예시
    // console.log('Guest token generated:', guestToken); // 콘솔에 토큰 출력
    res.status(200).json({ token: guestToken });
});

module.exports = router;
