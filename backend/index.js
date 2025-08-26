const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors({
    origin: process.env.FRONT_ORIGIN,
    credentials: true  // ✅ 쿠키 허용
}));

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB 연결 성공"))
    .catch((err) => console.log("연결 실패", err));

const bucketRoutes = require('./routes/bucketRoutes');
app.use('/api/buckets', bucketRoutes);

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send("Hello Express");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});