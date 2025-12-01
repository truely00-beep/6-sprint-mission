import { verifyAccessToken } from './jwt.js';

export const optionalAuthMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = verifyAccessToken(token);
      if (decoded) {
        req.userId = decoded.userId;
      }
    }
    next();
  } catch (error) {
    next();
  }
};



