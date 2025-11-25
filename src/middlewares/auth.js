import { expressjwt } from 'express-jwt';
import prisma from '../lib/prismaClient.js';
import { BadRequestError } from '../lib/error.js';

// 리퀘스트 토큰 검증 미들웨어
const verifyRefreshToken = expressjwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'],
  getToken: (req) => req.cookies.refreshToken,
});

// 엑세스 토큰 검증 미들웨어
const verifyAccessToken = expressjwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'],
  getToken: (req) => req.cookies.accessToken,
});

// 유저 인가 미들웨어
async function AuthorizationUser(req, res, next) {
  const { userId } = req.auth;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) next(new BadRequestError());
  req.user = user;
  return next();
}

export { verifyRefreshToken, verifyAccessToken, AuthorizationUser };
