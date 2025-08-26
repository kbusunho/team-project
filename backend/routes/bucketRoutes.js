const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Bucket = require("../models/Bucket");
const auth = require("../middelwares/auth");

// ObjectId 검증
const ensureObjectId = (id, res) => {
  if (!mongoose.isValidObjectId(id)) {
    res.status(400).json({ message: "유효하지 않은 ID 형식입니다." });
    return false;
  }
  return true;
};

// Create bucket
router.post("/", auth, async (req, res) => {
  try {
    console.log('Received bucket data:', req.body);
    const newBucket = new Bucket(req.body);
    const savedBucket = await newBucket.save();
    res.status(201).json(savedBucket);
  } catch (error) {
    console.error('Bucket save error:', error.message);
    res.status(400).json({ error: "버킷을 저장하지 못했습니다." });
  }
});

// Read all buckets
router.get("/", auth, async (req, res) => {
  try {
    const buckets = await Bucket.find({ uid: req.user.uid });
    res.status(200).json(buckets);
  } catch (error) {
    console.error('Fetch buckets error:', error.message);
    res.status(500).json({ error: "버킷 목록을 가져오지 못했습니다." });
  }
});

// DELETE bucket
router.delete("/:id", async (req, res) => {
  if (!ensureObjectId(req.params.id, res)) return;

  try {
    const uid = req.user?.uid || req.body.uid;
    if (!uid) return res.status(400).json({ message: "UID 필요" });

    const deletedBucket = await Bucket.findOneAndDelete({ _id: req.params.id, uid });
    if (!deletedBucket)
      return res.status(404).json({ message: "버킷을 찾을 수 없습니다." });

    res.status(200).json({ message: "삭제 성공" });
  } catch (error) {
    console.error("Delete bucket error:", error.message);
    res.status(500).json({ error: "삭제 실패" });
  }
});

// PATCH bucket text
router.patch("/:id/text", async (req, res) => {
  if (!ensureObjectId(req.params.id, res)) return;

  try {
    const uid = req.user?.uid || req.body.uid;
    if (!uid) return res.status(400).json({ message: "UID 필요" });

    const updatedBucket = await Bucket.findOneAndUpdate(
      { _id: req.params.id, uid },
      { text: req.body.text },
      { new: true, runValidators: true }
    );

    if (!updatedBucket)
      return res.status(404).json({ message: "버킷을 찾을 수 없습니다." });

    res.status(200).json({ bucket: updatedBucket });
  } catch (error) {
    console.error("Update bucket error:", error.message);
    res.status(500).json({ error: "수정 실패" });
  }
});

module.exports = router;
