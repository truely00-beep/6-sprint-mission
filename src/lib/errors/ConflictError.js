class ConflictError extends Error {
  constructor(message = '이미 존재하는 데이터입니다.') {
    super(message);
    this.name = 'ConflictError';
    this.status = 409;
  }
}

export default ConflictError;
