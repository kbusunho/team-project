const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Bucket = require("../models/Bucket");

// ✅ auth 미들웨어 추가
console.log('Trying to load auth middleware from:', require.resolve('../middlewares/auth')); // 디버깅 추가
const auth = require('../middlewares/auth');

const ensureObjectId = (id, res) => {
    if (!mongoose.isValidObjectId(id)) {
        res.status(400).json({ message: "유효하지 않은 ID형식입니다." });
        return false;
    }
    return true;
};

// 생성 (✅ auth 미들웨어 적용)
router.post("/", auth, async (req, res) => {
    try {
        console.log('Received bucket data:', req.body); // ✅ 디버깅용 로그
        const newBucket = new Bucket(req.body);
        const savedBucket = await newBucket.save();
        res.status(201).json(savedBucket);
    } catch (error) {
        console.error('Bucket save error:', error.message); // ✅ 디버깅용 로그
        res.status(400).json({ error: "버킷을 저장하지 못했습니다." });
    }
});

// 나머지 코드는 이전과 동일...
module.exports = router;