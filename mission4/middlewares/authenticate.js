import { prisma } from '../src/lib/prismaClient.js';
import { verifyAccessToken } from '../src/lib/token.js';
import { ACCESS_TOKEN_COOKIE_NAME } from '../src/lib/constants.js';
import { UnauthorizedError } from '../src/lib/errors/customErrors.js';

async function authenticate(req, res, next) {
  const accessToken = req.cookies[ACCESS_TOKEN_COOKIE_NAME];
  if (!accessToken) {
    return next(new UnauthorizedError());
  }
  try {
    const { userId } = verifyAccessToken(accessToken); //디코딩 된 토큰에서 user id 추출
    const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
    req.user = user;
    return next();
  } catch (error) {
    return next(new UnauthorizedError());
  }
}

export default authenticate;
