// lib/errors/ForbiddenError.js
class ForbiddenError extends Error {
  constructor(message = '권한이 없습니다.') {
    super(message);
    this.name = 'ForbiddenError';
    this.statusCode = 403;
  }
}

export default ForbiddenError;
