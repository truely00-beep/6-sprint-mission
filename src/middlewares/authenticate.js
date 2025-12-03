import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_COOKIE_NAME } from '../lib/constants.js';
import { verifyAccessToken } from '../lib/token.js';
import { prismaClient } from '../lib/prismaClient.js';

export default function authenticate(options = { optional: false }) {
  return async (req, res, next) => {
    const accessToken = req.cookies[ACCESS_TOKEN_COOKIE_NAME];
    if (!accessToken) {
      if (options.optional) {
        return next();
      }
      return res.status(401).send({ message: '인증이 필요합니다.' });
    }

    try {
      const { userId } = verifyAccessToken(accessToken);
      const user = await prismaClient.user.findUnique({ where: { id: userId } });
      req.user = user;
    } catch (error) {
      if (options.optional) {
        return next();
      }
      return res.status(401).send({ message: '유효하지 않은 토큰입니다.' });
    }
    next();
  };
}
