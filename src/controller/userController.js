import { BadRequestError } from '../lib/error.js';
import prisma from '../lib/prismaClient.js';
import userService from '../services/userService.js';

async function createUser(req, res, next) {
  const { email, password, ...rest } = req.body;
  const existedUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existedUser) return next(new BadRequestError());

  const hashedPassword = await userService.hashingPassword(password);
  const createdUser = await prisma.user.create({
    data: {
      ...rest,
      email,
      password: hashedPassword,
    },
  });
  const data = await userService.filterSensitiveUserData(createdUser);
  return res.status(200).json(data);
}

async function loginUser(req, res, next) {
  const { email, password } = req.body;
  const user = await userService.getUser(email, password);
  const accessToken = await userService.createToken(user);
  const refreshToken = await userService.createToken(user, 'refresh');
  await prisma.user.update({ where: { email }, data: { refreshToken } });
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: 'Lax',
  });
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: 'Lax',
  });
  return res.status(200).json({ message: '로그인 성공' });
}

async function newRefreshToken(req, res, next) {
  const { refreshToken } = req.cookies;
  const { userId } = req.auth;
  const { accessToken, newRefreshToken } = await userService.refreshToken(
    userId,
    refreshToken
  );
  await prisma.user.update({
    where: { id: userId },
    data: { refreshToken: newRefreshToken },
  });
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: 'Lax',
  });
  res.cookie('refreshToken', newRefreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: 'Lax',
  });
  return res.status(200).json({ message: 'Refresh 성공' });
}

async function logOutUser(req, res, next) {
  const { userId } = req.auth;
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  await prisma.user.update({
    where: { id: userId },
    data: {
      refreshToken: null,
    },
  });
  return res.status(200).json({ message: '로그아웃 성공' });
}

async function getUserProfile(req, res, next) {
  const { id } = req.user;
  const data = await prisma.user.findUnique({ where: { id } });
  const formattedData = await userService.filterSensitiveUserData(data);
  return res.status(200).json(formattedData);
}

async function updateUserProfile(req, res, next) {
  const { id } = req.user;
  const { nickname, image, password, newPassword } = req.body;
  const { email } = await prisma.user.findUnique({ where: { id } });
  const user = await userService.getUser(email, password);
  const hashingNewPassword = await userService.hashingPassword(newPassword);
  const updatedUser = await prisma.user.update({
    where: { id },
    data: { nickname, image, password: hashingNewPassword },
  });
  const newAccessToken = await userService.createToken(updatedUser);
  const newRefreshToken = await userService.createToken(updatedUser, 'refresh');
  const newUser = await prisma.user.update({
    where: { id },
    data: { refreshToken: newRefreshToken },
  });
  res.cookie('accessToken', newAccessToken, {
    httpOnly: true,
    secure: false,
    sameSite: 'Lax',
  });
  res.cookie('refreshToken', newRefreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: 'Lax',
  });
  const formattedData = await userService.filterSensitiveUserData(newUser);
  return res.status(200).json(formattedData);
}

async function getUserProducts(req, res, next) {
  const { id } = req.user;
  const products = await prisma.product.findMany({ where: { userId: id } });
  return res.status(200).json(products);
}

export {
  createUser,
  loginUser,
  newRefreshToken,
  logOutUser,
  getUserProfile,
  updateUserProfile,
  getUserProducts,
};
