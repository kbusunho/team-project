// backend/index.js
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 로깅
console.log("Loaded environment variables:", {
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI ? "Set" : "Not set",
    JWT_SECRET: process.env.JWT_SECRET ? "Set" : "Not set",
    FRONT_ORIGIN: process.env.FRONT_ORIGIN ? process.env.FRONT_ORIGIN : "Not set"
});

// 미들웨어
app.use(express.json());
app.use(cookieParser());

// CORS 설정 (로컬 + 배포 환경)
app.use(cors({
    origin: process.env.FRONT_ORIGIN,
    credentials: true
}));

// 요청 로그
app.use((req, res, next) => {
    console.log(`Received ${req.method} request from: ${req.headers.origin} to ${req.url}`);
    next();
});

// MongoDB 연결
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB 연결 성공"))
    .catch(err => {
        console.log("MongoDB 연결 실패", err.message);
        console.log("MongoDB URI:", process.env.MONGO_URI);
        process.exit(1);
    });

// 라우터
const bucketRoutes = require('./routes/bucketRoutes');
app.use('/api/buckets', bucketRoutes);

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// 기본 라우트
app.get('/', (req, res) => {
    res.send("Hello Express");
});

// 글로벌 에러 핸들러
app.use((err, req, res, next) => {
    console.error("Global error handler:", err.stack);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
});

// 서버 시작
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
