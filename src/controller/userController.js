import { BadRequestError } from '../lib/error.js';
import prisma from '../lib/prismaClient.js';
import {
  createToken,
  filterSensitiveUserData,
  getUser,
  hashingPassword,
} from '../services/userService.js';

async function createUser(req, res, next) {
  const { email, password, ...rest } = req.body;
  const existedUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existedUser) return next(new BadRequestError());

  const hashedPassword = await hashingPassword(password);
  const createdUser = await prisma.user.create({
    data: {
      ...rest,
      email,
      password: hashedPassword,
    },
  });
  const data = await filterSensitiveUserData(createdUser);
  return res.status(200).json(data);
}

async function loginUser(req, res, next) {
  const { email, password } = req.body;
  const user = await getUser(email, password);
  const accessToken = await createToken(user);
  const refreshToken = await createToken(user, 'refresh');
  await prisma.user.update({ where: { email }, data: { refreshToken } });
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'Lax',
  });
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'Lax',
  });
  return res.status(200).json({ message: '로그인 성공' });
}

export { createUser, loginUser };
