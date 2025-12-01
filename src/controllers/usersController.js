import bcrypt from 'bcrypt';
import { prismaClient } from '../lib/prismaClient.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../lib/jwt.js';
import { create } from 'superstruct';
import {
  signupStruct,
  loginStruct,
  updateUserStruct,
  changePasswordStruct,
} from '../structs/usersStruct.js';
import BadRequestError from '../lib/errors/BadRequestError.js';
import NotFoundError from '../lib/errors/NotFoundError.js';
import UnauthorizedError from '../lib/errors/UnauthorizedError.js';
import { withAsync } from '../lib/withAsync.js';

export const signup = withAsync(async (req, res) => {
  const data = create(req.body, signupStruct);

  const existingUser = await prismaClient.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new BadRequestError('이미 존재하는 이메일입니다.');
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await prismaClient.user.create({
    data: {
      email: data.email,
      nickname: data.nickname,
      password: hashedPassword,
    },
    select: {
      id: true,
      email: true,
      nickname: true,
      image: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  res.status(201).json({ user });
});

export const login = withAsync(async (req, res) => {
  const data = create(req.body, loginStruct);

  const user = await prismaClient.user.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    throw new UnauthorizedError('이메일 또는 비밀번호가 올바르지 않습니다.');
  }

  const isPasswordValid = await bcrypt.compare(data.password, user.password);

  if (!isPasswordValid) {
    throw new UnauthorizedError('이메일 또는 비밀번호가 올바르지 않습니다.');
  }

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  res.json({
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      image: user.image,
    },
  });
});

export const refresh = withAsync(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new BadRequestError('Refresh Token이 필요합니다.');
  }

  const decoded = verifyRefreshToken(refreshToken);

  if (!decoded) {
    throw new UnauthorizedError('유효하지 않은 Refresh Token입니다.');
  }

  const user = await prismaClient.user.findUnique({
    where: { id: decoded.userId },
  });

  if (!user) {
    throw new NotFoundError('사용자를 찾을 수 없습니다.');
  }

  const newAccessToken = generateAccessToken(user.id);
  const newRefreshToken = generateRefreshToken(user.id);

  res.json({
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  });
});

export const getMe = withAsync(async (req, res) => {
  const userId = req.userId;

  const user = await prismaClient.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      nickname: true,
      image: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new NotFoundError('사용자를 찾을 수 없습니다.');
  }

  res.json({ user });
});

export const updateMe = withAsync(async (req, res) => {
  const userId = req.userId;
  const data = create(req.body, updateUserStruct);

  const user = await prismaClient.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      email: true,
      nickname: true,
      image: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  res.json({ user });
});

export const changePassword = withAsync(async (req, res) => {
  const userId = req.userId;
  const data = create(req.body, changePasswordStruct);

  const user = await prismaClient.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new NotFoundError('사용자를 찾을 수 없습니다.');
  }

  const isPasswordValid = await bcrypt.compare(data.currentPassword, user.password);

  if (!isPasswordValid) {
    throw new UnauthorizedError('현재 비밀번호가 올바르지 않습니다.');
  }

  const hashedPassword = await bcrypt.hash(data.newPassword, 10);

  await prismaClient.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  res.json({ message: '비밀번호가 변경되었습니다.' });
});

export const getMyProducts = withAsync(async (req, res) => {
  const userId = req.userId;

  const products = await prismaClient.product.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  res.json({ products });
});
