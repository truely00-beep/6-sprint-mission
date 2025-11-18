// server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const db = require("./models");
const errorHandler = require("./middleware/errorHandler");
const { NotFoundError } = require("./middleware/CustomError");

// 라우터 모듈 로드
const marketRouter = require("./routes/marketRouter");
const forumRouter = require("./routes/forumRouter");
const commentRouter = require("./routes/commentRouter");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 1. CORS 설정
const corsOptions = {
  origin: process.env.CORS_ORIGIN || "*", // .env에 설정된 ORIGIN 사용, 없으면 '*'
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));

// 2. 기본 미들웨어
app.use(express.json()); // JSON 요청 본문 파싱
app.use(express.urlencoded({ extended: true })); // URL-encoded 요청 본문 파싱

// 이미지 업로드 디렉토리 정적 제공
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 3. 라우터 설정
app.use("/api/market", marketRouter);
app.use("/api/forum", forumRouter);
// 중복 제거된 공통 댓글 수정/삭제 라우트
app.use("/api/comments", commentRouter);

// 4. 404 에러 처리 (라우트에 일치하는 요청이 없는 경우)
app.use((req, res, next) => {
  next(
    new NotFoundError(`요청하신 경로(${req.originalUrl})를 찾을 수 없습니다.`)
  );
});

// 5. 중앙 에러 핸들러 미들웨어 (가장 마지막에 위치)
app.use(errorHandler);

// 서버 실행 및 DB 동기화
(async () => {
  try {
    // DB 연결 및 모델 동기화 (마이그레이션을 사용하는 경우 force: false)
    await db.sequelize.sync({ force: false });
    console.log("✅ Database connected and models synchronized.");

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error(
      "❌ Unable to connect to the database or start server:",
      error
    );
    process.exit(1);
  }
})();
