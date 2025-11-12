import { Prisma } from '@prisma/client';

// middlewares/errorHandler.js
export function errorHandler(err, req, res, next) {
  console.error('🔥 Error:', err);

  if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
    res.status(404).send({ message: '리소스를 찾을 수 없습니다.' });
  } else if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
    res.status(400).send({ message: '중복된 데이터입니다.' });
  } else if (err.name === 'StructError') {
    res.status(400).send({ message: '잘못된 입력 형식입니다.' });
  } else {
    res.status(500).send({ message: '서버 내부 오류가 발생했습니다.' });
  }
}
