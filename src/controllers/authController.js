import { create } from 'superstruct';
import bcrypt from 'bcrypt';
import { LoginBodyStruct, RegisterBodyStruct } from '../structs/authStructs.js';
import { prismaClient } from '../lib/prismaClient.js';
import BadRequestError from '../lib/errors/BadRequestError.js';
import { generateTokens } from '../lib/token.js';
import { ACCESS_TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME } from '../lib/constants.js';

export async function register(req, res) {
  const { email, nickname, password } = create(req.body, RegisterBodyStruct);

  // password는 해싱해 저장합니다.
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const isExists = await prismaClient.user.findUnique({ where: { email } });
  if (isExists) {
    throw new BadRequestError('이미 사용 중인 이메일입니다.');
  }

  const user = await prismaClient.user.create({
    data: { email, nickname, password: hashedPassword },
  });

  const { password: _, ...userWithoutPassword } = user;
  res.status(201).send(userWithoutPassword);
}

export async function login(req, res) {
  const { email, password } = create(req.body, LoginBodyStruct);

  // 이메일로 사용자 찾고
  const user = await prismaClient.user.findUnique({ where: { email } });
  if (!user) {
    throw new BadRequestError('이메일 또는 비밀번호가 올바르지 않습니다.');
  }

  // 비밀번호 검증
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new BadRequestError('이메일 또는 비밀번호가 올바르지 않습니다.');
  }

  // 토큰 발급
  const { accessToken, refreshToken } = generateTokens(user.id);
  setTokenCookies(res, accessToken, refreshToken);

  res.status(200).send();
}

export async function logout(req, res) {
  clearTokenCookies(res);
  res.status(200).send();
}

function setTokenCookies(res, accessToken, refreshToken) {
  res.cookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, {
    httpOnly: true,
    secure: false,
    maxAge: 60 * 60 * 1000, // 1 hour
  });
  res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
    httpOnly: true,
    secure: false,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
}

function clearTokenCookies(res) {
  res.clearCookie(ACCESS_TOKEN_COOKIE_NAME);
  res.clearCookie(REFRESH_TOKEN_COOKIE_NAME);
}
