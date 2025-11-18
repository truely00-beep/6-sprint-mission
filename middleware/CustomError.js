// middleware/CustomError.js
class CustomError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
    this.name = this.constructor.name;
    // V8 환경에서 스택 트레이스를 캡처 (성능 최적화)
    Error.captureStackTrace(this, this.constructor);
  }
}

class BadRequestError extends CustomError {
  constructor(message = "잘못된 요청입니다.") {
    super(message, 400);
  }
}

class NotFoundError extends CustomError {
  constructor(message = "요청한 리소스를 찾을 수 없습니다.") {
    super(message, 404);
  }
}

module.exports = {
  CustomError,
  BadRequestError,
  NotFoundError,
};
