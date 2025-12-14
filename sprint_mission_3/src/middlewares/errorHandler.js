import { Prisma } from "@prisma/client"

// 전역 함수로써 사용(asyncHandler에서 next(err)로 에러 보냄)
export async function errorHandler(err, req, res, next) {
  console.error('🔥 errorHandler 안에서 출력되는 error내용: ', err);

  // ✅ 1. 서비스에서 직접 던진 HTTP 에러 처리 (가장 위!)
  if (err.status) {
    console.log('error status: ', err.status)
    return res.status(err.status).json({
      message: err.message
    });
  }

  // 2. Prisma "레코드 없음"
  if (
    err instanceof Prisma.PrismaClientKnownRequestError &&
    err.code === 'P2025'
  ) {
    return res.sendStatus(404);
  }

  // 3. Prisma unique 제약조건 위반
  if (
    err instanceof Prisma.PrismaClientKnownRequestError &&
    err.code === 'P2002'
  ) {
    return res.status(400).json({ message: 'Duplicate field value' });
  }

  // 4. superstruct 검증 에러
  if (err.name === 'StructError') {
    return res.status(400).json({ message: 'Struct Error' });
  }

  // 5. 나머지 (알 수 없는 서버 에러)
  return res.status(500).json({
    message: err.message || 'Internal Server Error'
  });
}
