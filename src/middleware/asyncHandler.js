import { Prisma } from '@prisma/client';

export const asyncHandler = (handler) => {
  return async function (req, res, next) {
    try {
      await handler(req, res, next);
    } catch (e) {
      if (
        e.name === 'StructError' ||
        e instanceof Prisma.PrismaClientValidationError
      ) {
        res.status(400).json({ message: e.message });
      } else if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2025'
      ) {
        res.sendStatus(404);
      } else {
        res.status(500).json({ message: e.message });
      }
    }
  };
};
