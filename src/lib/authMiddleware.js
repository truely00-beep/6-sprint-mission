import { verifyAccessToken } from './jwt.js';
import UnauthorizedError from './errors/UnauthorizedError.js';

export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('인증 토큰이 필요합니다.');
    }

    const token = authHeader.substring(7);
    const decoded = verifyAccessToken(token);

    if (!decoded) {
      throw new UnauthorizedError('유효하지 않은 토큰입니다.');
    }

    req.userId = decoded.userId;
    next();
  } catch (error) {
    next(error);
  }
};
