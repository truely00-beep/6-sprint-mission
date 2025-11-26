import bcrypt from 'bcrypt';
import prisma from '../lib/prisma.js';
import NotFoundError from '../lib/errors/NotFoundError.js';
import { generateTokens, verifyRefreshToken } from '../lib/token.js';
import { clearTokenCookies, setTokenCookies } from '../lib/cookie.js';
import { REFRESH_TOKEN_COOKIE_NAME } from '../lib/constants.js';
import ValidationError from '../lib/errors/ValidationError.js';
import ConflictError from '../lib/errors/ConflictError.js';

class UserController {
  //회원가입
  async register(req, res, next) {
    try {
      //이메일, 닉네임, 비밀번호 받기
      const { email, nickname, password } = req.body;
      //입력값 검증
      if (!email) {
        throw new ValidationError('이메일은 필수입니다.');
      }
      if (!password) {
        throw new ValidationError('비밀번호는 필수입니다.');
      }
      if (!nickname) {
        throw new ValidationError('닉네임은 필수입니다.');
      }

      //중복값 검증
      const check = await prisma.user.findFirst({
        where: { nickname },
      });
      if (check) {
        throw new ConflictError('이미 존재하는 닉네임입니다.');
      }

      //비밀번호 해싱 과정
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      //회원 생성
      const user = await prisma.user.create({
        data: { email, nickname, password: hashedPassword },
      });

      //비밀번호 제외 출력
      const { password: _, ...userWithoutPassword } = user;

      res.status(201).send(userWithoutPassword);
    } catch (err) {
      next(err);
    }
  }

  //로그인
  async login(req, res, next) {
    try {
      const { nickname, password } = req.body;

      //닉네임 확인
      const user = await prisma.user.findFirst({ where: { nickname } });
      if (!user) {
        throw new NotFoundError('닉네임을 찾을 수 없습니다.');
      }

      //비밀번호 확인
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new ValidationError('비밀번호가 일치하지 않습니다.');
      }

      //토큰 생성
      const { accessToken, refreshToken } = generateTokens(user.id);
      setTokenCookies(res, accessToken, refreshToken);

      res.status(200).send();
    } catch (err) {
      next(err);
    }
  }

  //토큰 재발급
  async refreshTokens(req, res, next) {
    try {
      const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE_NAME];
      // 토큰 확인
      if (!refreshToken) {
        throw new NotFoundError('토큰이 존재하지 않습니다.');
      }
      //토큰 유효성 검사, 유저 아이디 추출
      const { userId } = verifyRefreshToken(refreshToken);
      //유저 확인
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        throw new NotFoundError('유저가 존재하지 않습니다.');
      }

      const { accessToken, refreshToken: newRefreshToken } = generateTokens(user.id);
      setTokenCookies(res, accessToken, newRefreshToken);
      res.status(200).send();
    } catch (err) {
      next(err);
    }
  }

  async logout(req, res) {
    clearTokenCookies(res);
    res.status(200).send();
  }
}

export default new UserController();
