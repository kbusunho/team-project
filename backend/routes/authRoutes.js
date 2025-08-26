// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.post('/guest', (req, res) => {
    const deviceId = req.body.deviceId || Math.random().toString(36).substring(2);

    const token = jwt.sign(
        { uid: deviceId },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );

    res.cookie('auth', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none', // 로컬/배포 호환
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7일
    });

    console.log('Guest JWT issued:', token);
    res.status(200).json({ uid: deviceId });
});

module.exports = router;
