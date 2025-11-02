import { Prisma } from '@prisma/client';

export const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      return res.status(400).json({ message: '이미 존재하는 데이터입니다.' });
    }
    if (err.code === 'P2025') {
      return res
        .status(404)
        .json({ message: '해당 데이터를 찾을 수 없습니다.' });
    }
  }

  if (err.name === 'StructError') {
    return res.status(400).json({ message: err.message });
  }

  res.status(500).json({ message: '서버 내부 오류가 발생했습니다.' });
};
