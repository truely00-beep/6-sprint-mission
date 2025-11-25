export const errorHandlerMiddleware = (err, req, res, next) => {
  console.error(err.stack);

  if (err.code === 'P2025') {
    return res.status(404).json({ message: '데이터를 찾을 수 없습니다.' });
  }

  if (err.name === 'PrismaClientValidationError') {
    return res.status(400).json({ message: '요청 데이터 형식이 올바르지 않습니다.' });
  }

  if (err.name === 'StructError') {
    return res.status(400).json({
      message: `입력 값 형식이 올바르지 않습니다. (${err.message})`,
    });
  }

  const status = err.status || 500;
  if (status >= 400 && status < 500) {
    return res.status(status).json({ message: err.message });
  }

  return res.status(500).json({ message: '서버 내부 오류가 발생했습니다.' });
};

export function defaultNotFoundHandler(req, res, next) {
  return res.status(404).send({ message: '요청하신 페이지를 찾을 수 없습니다.' });
}
