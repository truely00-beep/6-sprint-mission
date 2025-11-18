// middleware/errorHandler.js
const { CustomError } = require("./CustomError");

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  console.error("⚠️ Global Error Handler:", err);

  let status = 500;
  let message = "서버 내부 오류가 발생했습니다.";
  let errors = [];

  if (err instanceof CustomError) {
    // 400 시리즈: 사용자 입력 오류, 리소스 찾을 수 없음 등
    status = err.status;
    message = err.message;
  } else if (
    err.name === "SequelizeValidationError" ||
    err.name === "SequelizeUniqueConstraintError"
  ) {
    // Sequelize 유효성 검증 오류
    status = 400;
    message = "데이터베이스 유효성 검증에 실패했습니다.";
    errors = err.errors.map((e) => ({ field: e.path, message: e.message }));
  } else if (
    err.name === "JsonWebTokenError" ||
    err.name === "TokenExpiredError"
  ) {
    // 인증 오류 (예시)
    status = 401;
    message = "유효하지 않거나 만료된 토큰입니다.";
  } else if (err.code === "LIMIT_FILE_SIZE") {
    // Multer 파일 크기 제한 오류
    status = 400;
    message = "업로드 파일 크기가 제한을 초과했습니다.";
  }

  // 개발 환경에서는 스택 트레이스 포함
  const stack = process.env.NODE_ENV === "development" ? err.stack : undefined;

  res.status(status).json({
    success: false,
    status: status,
    message: message,
    errors: errors.length > 0 ? errors : undefined,
    stack: stack,
  });
};

module.exports = errorHandler;
