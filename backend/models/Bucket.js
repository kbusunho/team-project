// backend/models/Bucket.js
const mongoose = require("mongoose");

const bucketSchema = new mongoose.Schema({
  uid: { type: String, required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Bucket", bucketSchema);
