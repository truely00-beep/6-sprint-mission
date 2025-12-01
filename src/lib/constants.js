import dotenv from 'dotenv';
dotenv.config();

export const DATABASE_URL = process.env.DATABASE_URL;
export const PORT = process.env.PORT || 3000;
export const PUBLIC_PATH = './public';
export const STATIC_PATH = '/public';
export const JWT_SECRET =
  process.env.JWT_ACCESS_TOKEN_SECRET || process.env.JWT_SECRET || 'your-secret-key';
export const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_TOKEN_SECRET ||
  process.env.JWT_REFRESH_SECRET ||
  'your-refresh-secret-key';

// JWT_ACCESS_TOKEN_SECRET과 JWT_REFRESH_TOKEN_SECRET으로도 export (jwt.js에서 사용)
export const JWT_ACCESS_TOKEN_SECRET = JWT_SECRET;
export const JWT_REFRESH_TOKEN_SECRET = JWT_REFRESH_SECRET;
