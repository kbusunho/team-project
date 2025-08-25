const mongoose = require("mongoose");

const bucketSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        goal: { type: String, required: true, trim: true },
        text: { type: String, trim: true },
        isCompleted: { type: Boolean, default: false },
        date: { type: Date, default: Date.now }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Bucket", bucketSchema);
