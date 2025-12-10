import prisma from '../lib/prismaClient.js';
import { verifyAccessToken } from '../lib/token.js';
import { ACCESS_TOKEN_COOKIE_NAME } from '../lib/constants.js';

export default async function authenticate(req, res, next) {
  const token = req.cookies?.[ACCESS_TOKEN_COOKIE_NAME];

  if (!token) {
    return res.status(401).json({ message: '로그인이 필요합니다.' });
  }

  try {
    const decoded = verifyAccessToken(token);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!user) {
      return res.status(401).json({ message: '유효하지 않은 사용자입니다.' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ message: '토큰이 만료되었거나 잘못되었습니다.' });
  }
}
