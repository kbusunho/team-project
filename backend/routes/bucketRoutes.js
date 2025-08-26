const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Bucket = require("../models/Bucket");

const ensureObjectId = (id, res) => {
    if (!mongoose.isValidObjectId(id)) {
        res.status(400).json({ message: "유효하지 않은 ID형식입니다." });
        return false;
    }
    return true;
};

// 생성 (✅ auth 미들웨어 추가 추천: require('../middlewares/auth'))
router.post("/", async (req, res) => {
    try {
        const newBucket = new Bucket(req.body);
        const savedBucket = await newBucket.save();

        res.status(201).json(savedBucket);
    } catch (error) {
        res.status(400).json({ error: "버킷을 저장하지 못했습니다." });
    }
});

// 나머지 라우트 동일...
// (전체 조회, 단일 조회, 수정, 삭제, 완료 상태 변경, 텍스트 수정 - 기존 그대로)

module.exports = router;