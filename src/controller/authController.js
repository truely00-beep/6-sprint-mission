import { prisma } from '../utils/prismaClient.js';
import bcrypt from 'bcrypt';
import { generateTokens, verifyRefreshToken } from '../utils/token.js';
import { clearTokenCookies, setTokenCookies } from '../utils/cookies.js';
import { JWT_ACCESS_TOKEN_SECRET, REFRESH_TOKEN_COOKIE_NAME } from '../utils/constants.js';

export class AuthController {
  //회원가입
  static register = async (req, res) => {
    const { userPreference, password, ...userFields } = req.body;
    const received = userPreference ? userPreference.receivedEmail : false;
    const profileImage = req.file;

    let image;
    if (profileImage) {
      image = { create: { url: `/files/user-profiles/${profileImage.filename}` } };
    }

    const user = await prisma.user.create({
      data: {
        ...userFields,
        password,
        userPreference: {
          create: {
            receivedEmail: received,
          },
        },
        profileImage: image,
      },
    });
    const { password: _, ...userWithoutPassword } = user;
    res.status(201).send(userWithoutPassword);
  };
  // 로그인
  static login = async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).send({ message: '사용자가 존재하지 않습니다.' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send({ message: '비밀번호가 일치하지 않습니다.' });
    }
    const { accessToken, refreshToken } = generateTokens(user.id); // 토큰 생성
    setTokenCookies(res, accessToken, refreshToken); // set-cookie 헤더에 토큰을 담아 Http형식으로 브라우저에 전송
    res.status(200).send({ message: `${user.name}님 로그인이 성공적으로 완료 됐습니다.` });
  };
  //토큰 재발급
  static refreshToken = async (req, res) => {
    const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE_NAME];
    if (!refreshToken) {
      return res.status(401).send({ message: '잘못된 접근입니다.' });
    }

    const { userId } = verifyRefreshToken(refreshToken); //클라이언트에서 넘어온 토큰이 우리 서버에서 내려준 토큰과 일치하는지 검증

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(401).send({ message: '유효하지 않은 이메일입니다.' });
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user.id);

    setTokenCookies(res, accessToken, newRefreshToken);

    res.status(200).send({ message: '토큰 재발급 성공' });
  };

  static logout = async (req, res) => {
    clearTokenCookies(res);
    res.status(200).send({ message: '로그아웃이 완료 됐습니다.' });
  };

  static getInfo = async (req, res) => {
    const userId = parseInt(req.params.userId);
    const user = req.user;
    const userInfo = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        nickname: true,
        email: true,
        createdAt: true,
        profileImage: {
          select: {
            url: true,
          },
        },
      },
    });
    if (!userInfo) {
      return res.status(401).send({ message: '회원을 찾을 수 없습니다,' });
    }
    if (userInfo.id !== user.id) {
      return res.status(401).send({ message: '잘못된 접근입니다.' });
    }
    res.status(200).send(userInfo);
  };
}
