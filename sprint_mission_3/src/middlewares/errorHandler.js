import { Prisma } from "@prisma/client"

// 전역 함수로써 사용(asyncHandler에서 next(err)로 에러 보냄)
export async function errorHandler(err, req, res, next) {
  console.error('🔥 Error:', err)

  if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
    res.sendStatus(404);
  } else if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
    res.sendStatus(400);
  } else if (err.name == 'StructError') {
    res.status(400).send({ message: "Struct Error" })
  } else {
    res.status(500).send({ message: err.message})
  }
}