class UnauthorizedError extends Error {
  constructor(message = '인증/인가에 실패했습니다.') {
    super(message);
    this.status = 401;
  }
}

export default UnauthorizedError;
