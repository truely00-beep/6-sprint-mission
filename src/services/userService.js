import prisma from '../lib/prismaClient.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { BadRequestError } from '../lib/error.js';

async function hashingPassword(password) {
  return bcrypt.hash(password, 10);
}

async function filterSensitiveUserData(user) {
  const { password, refreshToken, ...rest } = user;
  return rest;
}

export { hashingPassword, filterSensitiveUserData };
