import { BadRequestError } from '../lib/error.js';
import prisma from '../lib/prismaClient.js';
import {
  filterSensitiveUserData,
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

export { createUser };
