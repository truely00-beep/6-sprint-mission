import dotenv from 'dotenv';
dotenv.config();

export const ACCESS_TOKEN_COOKIE_NAME = 'access-token';
export const REFRESH_TOKEN_COOKIE_NAME = 'refresh-token';
// as string을 붙여서 문자열이라고 알려줍니다.
export const DATABASE_URL = process.env.DATABASE_URL as string;
export const JWT_ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET as string;
export const JWT_REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET as string;
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const PORT = process.env.PORT || 3000;
export const PUBLIC_PATH = './public';
export const STATIC_PATH = '/public';
