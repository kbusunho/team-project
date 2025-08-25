const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser()); // ✅ 빠져있었음
app.use(cors({
    origin: process.env.FRONT_ORIGIN,
    credentials: true
}));

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB 연결 성공"))
    .catch((err) => console.error("❌ MongoDB 연결 실패:", err));

app.use('/api/buckets', require('./routes/bucketRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));

app.get('/', (req, res) => {
    res.send("Hello Express");
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
