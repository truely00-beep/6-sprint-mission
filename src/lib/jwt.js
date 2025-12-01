import jwt from 'jsonwebtoken';
import { JWT_ACCESS_TOKEN_SECRET, JWT_REFRESH_TOKEN_SECRET } from './constants.js';

export const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, JWT_ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
};

export const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, JWT_REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};

export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, JWT_ACCESS_TOKEN_SECRET);
  } catch (error) {
    return null;
  }
};

export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, JWT_REFRESH_TOKEN_SECRET);
  } catch (error) {
    return null;
  }
};
