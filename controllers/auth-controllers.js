import bcrypt from 'bcrypt';
import prisma from '../lib/prismaclient.js';
import {
  checkUser,
  clearTokenCookies,
  createTokenCookies,
} from '../server/authService.js';
import { createTokens } from '../lib/token.js';

export async function register(req, res) {
  const { nickname, password, email } = req.body;

  // email 중복 체크
  const checkEmail = await checkUser(email);

  // 비밀번호 해싱 작업
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // 사용자 등록
  const user = await prisma.user.create({
    data: {
      nickname,
      email: checkEmail,
      password: hashedPassword,
    },
  });

  // 최종 데이터 전달
  const { password: _, ...createUser } = user;
  res.status(200).json(createUser);
}

export async function login(req, res) {
  const { email, password } = req.body;

  // 사용자 유무 확인
  const userCheck = await prisma.user.findUnique({ where: { email } });
  if (!userCheck)
    return res.status(401).json({ message: 'Invalid credentials' });

  // 비밀번호 확인
  const isPasswordValid = await bcrypt.compare(password, userCheck.password);
  if (!isPasswordValid)
    return res.status(401).json({ message: 'password Recheck please!' });

  // 토큰 생성
  const { accessToken, refreshToken } = createTokens(userCheck.id);

  // 생성한 토큰을 쿠키값을 전달
  createTokenCookies(res, accessToken, refreshToken);

  res.status(200).json({ message: 'login ok!' });
}

export async function logout(req, res) {
  clearTokenCookies(res);
  res.status(200).json({ message: 'log out!' });
}
