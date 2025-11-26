import { expressjwt } from 'express-jwt';
import prisma from '../lib/prismaClient.js';
import { BadRequestError } from '../lib/error.js';
import jwt from 'jsonwebtoken';

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
async function authorizeUser(req, res, next) {
  const { userId } = req.auth;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) next(new BadRequestError());
  req.user = user;
  return next();
}

// 토큰 유무 확인하는 전역 미들웨어
function optionalAuth(req, res, next) {
  const token = req.cookies.accessToken;
  if (!token) return next();
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    // 검증 실패시 에러, 성공시 payload 반환
    if (!err) req.auth = decoded;
    next();
  });
}

export { verifyRefreshToken, verifyAccessToken, authorizeUser, optionalAuth };
