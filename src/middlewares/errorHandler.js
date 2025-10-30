export const errorHandlerMiddleware = (err, req, res, next) => {
  console.error(err.stack);

  if (err.code === 'P2025') {
    return res.status(404).json({ message: '데이터를 찾을 수 없습니다.' });
  }
  if (err.name === 'PrismaClientValidationError') {
    return res.status(400).json({ message: '요청 데이터 형식이 올바르지 않습니다.' });
  }
  res.status(500).json({ message: '서버 내부 오류가 발생했습니다.' });
};
