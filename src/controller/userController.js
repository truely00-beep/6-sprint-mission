import bcrypt from 'bcrypt';
import { assert } from 'superstruct';
import prisma from '../lib/prisma.js';
import NotFoundError from '../lib/errors/NotFoundError.js';
import { generateTokens, verifyRefreshToken } from '../lib/token.js';
import { clearTokenCookies, setTokenCookies } from '../lib/cookie.js';
import { REFRESH_TOKEN_COOKIE_NAME } from '../lib/constants.js';
import ValidationError from '../lib/errors/ValidationError.js';
import ConflictError from '../lib/errors/ConflictError.js';
import { patchUser, patchUserPassword } from '../structs/userStructs.js';

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

  //유저 자신의 정보 조희 GET
  async getUser(req, res, next) {
    try {
      const { nickname } = req.params;
      //닉네임으로 찾기
      const user = await prisma.user.findUnique({
        where: { nickname },
      });

      if (!user) {
        throw new NotFoundError('해당 닉네임을 찾을 수 없습니다.');
      }

      //비밀번호 제외 출력
      const { password: _, ...userWithoutPassword } = user;

      res.status(200).send(userWithoutPassword);
    } catch (err) {
      next(err);
    }
  }

  //유저 자신의 정보 수정 PATCH
  async updateUser(req, res, next) {
    try {
      assert(req.body, patchUser);

      const { nickname } = req.user;
      //닉네임으로 찾기
      const user = await prisma.user.update({
        where: { nickname },
        data: req.body,
      });
      //비밀번호 제외 출력
      const { password: _, ...userWithoutPassword } = user;

      res.status(200).send(userWithoutPassword);
    } catch (err) {
      next(err);
    }
  }

  //유저 비밀번호 변경 PATCH
  async updateUserPassword(req, res, next) {
    try {
      assert(req.body, patchUserPassword);

      const { currentPassword, newPassword } = req.body;
      const { nickname } = req.user;

      //기존 정보
      const user = await prisma.user.findUnique({
        where: { nickname },
      });
      //현재 비밀번호 검증
      const isValid = await bcrypt.compare(currentPassword, user.password);
      if (!isValid) throw new ValidationError('비밀번호가 일치하지 않습니다.');

      //새 비밀번호 해싱
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(newPassword, salt);

      await prisma.user.update({
        where: { nickname },
        data: { password: hashed },
      });

      res.status(200).send({ message: '비밀번호가 변경되었습니다.' });
    } catch (err) {
      next(err);
    }
  }
  //자신이 등록한 상품 목록 조회 GET
}

export default new UserController();
