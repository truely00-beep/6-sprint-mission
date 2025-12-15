import jwt from 'jsonwebtoken';
// import 경로에서 .js를 지웠습니다.
import { JWT_ACCESS_TOKEN_SECRET, JWT_REFRESH_TOKEN_SECRET } from './constants';

// userId에 number 타입을 붙여줍니다.
export function generateTokens(userId: number) {
  const accessToken = jwt.sign({ id: userId }, JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: '1h',
  });
  const refreshToken = jwt.sign({ id: userId }, JWT_REFRESH_TOKEN_SECRET, {
    expiresIn: '7d',
  });
  return { accessToken, refreshToken };
}

export function verifyAccessToken(token: string) {
  // 결과가 어떤 모양인지(id가 있는 객체) 알려줍니다.
  const decoded = jwt.verify(token, JWT_ACCESS_TOKEN_SECRET) as { id: number };
  return { userId: decoded.id };
}

export function verifyRefreshToken(token: string) {
  const decoded = jwt.verify(token, JWT_REFRESH_TOKEN_SECRET) as { id: number };
  return { userId: decoded.id };
}
