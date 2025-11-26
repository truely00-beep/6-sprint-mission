import jwt from 'jsonwebtoken';
import {
  JWT_ACCESS_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_SECRET,
} from './constants.js';

// 토큰 생성
function createTokens(userId) {
  const payload = { id: userId };
  const accessExpiresIn = { expiresIn: '1h' };
  const refreshExpiresIn = { expiresIn: '7d' };

  const accessToken = jwt.sign(
    payload,
    JWT_ACCESS_TOKEN_SECRET,
    accessExpiresIn
  );

  const refreshToken = jwt.sign(
    payload,
    JWT_REFRESH_TOKEN_SECRET,
    refreshExpiresIn
  );

  return { accessToken, refreshToken };
}

export { createTokens };
