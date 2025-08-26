const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser"); // ✅ 추가

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ 환경 변수 디버깅 로그
console.log("Loaded environment variables:", {
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI ? "Set" : "Not set",
    JWT_SECRET: process.env.JWT_SECRET ? "Set" : "Not set",
    FRONT_ORIGIN: process.env.FRONT_ORIGIN ? process.env.FRONT_ORIGIN : "Not set"
});

app.use(express.json());
app.use(cookieParser()); // ✅ 추가
app.use(cors({
    origin: process.env.FRONT_ORIGIN,
    credentials: true // ✅ 쿠키 허용
}));

// ✅ 요청 로그 추가 (디버깅용)
app.use((req, res, next) => {
    console.log(`Received ${req.method} request from: ${req.headers.origin} to ${req.url}`);
    next();
});

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB 연결 성공"))
    .catch((err) => {
        console.log("연결 실패", err.message); // ✅ 구체적인 오류 메시지 출력
        console.log("MongoDB URI:", process.env.MONGO_URI); // ✅ 디버깅용
        process.exit(1); // ✅ 연결 실패 시 프로세스 종료
    });

const bucketRoutes = require('./routes/bucketRoutes');
app.use('/api/buckets', bucketRoutes);

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// ✅ 기본 라우트
app.get('/', (req, res) => {
    res.send("Hello Express");
});

// ✅ 전역 에러 핸들러
app.use((err, req, res, next) => {
    console.error("Global error handler:", err.stack);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});