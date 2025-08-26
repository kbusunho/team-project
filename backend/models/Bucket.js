const mongoose = require("mongoose");

const bucketSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        goal: { type: String, required: true, trim: true },
        text: { type: String, trim: true },
        uid: { type: String, required: true }, // ✅ 사용자별 필터링을 위한 uid 추가
        isCompleted: { type: Boolean, default: false },
        date: { type: Date, default: Date.now }
    },
    { timestamps: true }
);

const Bucket = mongoose.model("Bucket", bucketSchema);

module.exports = Bucket;