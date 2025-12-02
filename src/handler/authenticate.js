import prisma from '../lib/prisma.js';
import { verifyAccessToken } from '../lib/token.js';
import { ACCESS_TOKEN_COOKIE_NAME } from '../lib/constants.js';
import UnauthorizedError from '../lib/errors/UnauthorizedError.js';

export async function authenticate(req, res, next) {
  try {
    const accessToken = req.cookies[ACCESS_TOKEN_COOKIE_NAME];
    if (!accessToken) {
      throw new UnauthorizedError('로그인이 필요합니다.');
    }

    const { userId } = verifyAccessToken(accessToken);
    const user = await prisma.user.findUnique({ where: { id: userId } });
    req.user = user;
    return next();
  } catch (err) {
    return next(err);
  }
}
