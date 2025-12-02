class ValidationError extends Error {
  constructor(message = '입력값이 없습니다.') {
    super(message);
    this.status = 400;
  }
}

export default ValidationError;
