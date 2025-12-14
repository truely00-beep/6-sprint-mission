class UnauthorizedError extends Error {
  // message 뒤에 ': string'을 붙여줍니다.
  constructor(message: string) {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export default UnauthorizedError;
