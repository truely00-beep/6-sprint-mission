import { prisma } from '../utils/prismaClient.js';
import { verifyAccessToken } from '../utils/token.js';
import { ACCESS_TOKEN_COOKIE_NAME } from '../utils/constants.js';

export const authenticate = async (req, res, next) => {
  const accessToken = req.cookies[ACCESS_TOKEN_COOKIE_NAME];
  if (!accessToken) {
    return res.status(401).send({ message: '유효하지 않은 접근입니다.' });
  }
  const { userId } = verifyAccessToken(accessToken);
  const user = await prisma.user.findUnique({ where: { id: userId } });
  req.user = user;
  next();
};
