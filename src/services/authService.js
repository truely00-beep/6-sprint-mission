import { prisma } from '../utils/prisma.js';
import bcrypt from 'bcrypt';
import { generateTokens, verifyRefreshToken } from '../utils/token.js';

async function signUp(email, nickname, password) {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error('이미 존재하는 이메일입니다.');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      nickname,
      password: hashedPassword,
    },
  });

  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

async function login(email, password) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error('존재하지 않는 이메일입니다.');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('비밀번호가 일치하지 않습니다.');
  }

  const { accessToken, refreshToken } = generateTokens(user.id);

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken },
  });

  return { user, accessToken, refreshToken };
}

async function refreshTokens(refreshToken) {
  const { userId } = verifyRefreshToken(refreshToken);

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new Error('사용자를 찾을 수 없습니다.');
  }

  if (user.refreshToken !== refreshToken) {
    throw new Error('유효하지 않은 Refresh Token입니다.');
  }

  const tokens = generateTokens(user.id);

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken: tokens.refreshToken },
  });

  return tokens;
}

export const authService = {
  signUp,
  login,
  refreshTokens,
};
