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
import ForbiddenError from '../lib/errors/ForbiddenError.js';
import UnauthorizedError from '../lib/errors/UnauthorizedError.js';

class UserController {
  //유저 자신의 정보 조희 GET
  async getMe(req, res) {
    //로그인된 유저
    const loginUser = req.user;

    if (!loginUser) {
      throw new UnauthorizedError('해당 유저가 없습니다.');
    }
    const user = await prisma.user.findUnique({
      where: { id: loginUser.id },
    });

    if (!user) {
      throw new NotFoundError('해당 닉네임을 찾을 수 없습니다.');
    }

    //비밀번호 제외 출력
    const { password: _, ...userWithoutPassword } = user;

    res.status(200).send(userWithoutPassword);
  }

  //유저 자신의 정보 수정 PATCH
  async updateMe(req, res) {
    assert(req.body, patchUser);

    //로그인된 유저 확인
    const loginUser = req.user;
    if (!loginUser) {
      throw new UnauthorizedError('해당 유저가 없습니다.');
    }

    const user = await prisma.user.update({
      where: { id: loginUser.id },
      data: req.body,
    });
    //비밀번호 제외 출력
    const { password: _, ...userWithoutPassword } = user;

    res.status(200).send(userWithoutPassword);
  }

  //유저 비밀번호 변경 PATCH
  async updateMyPassword(req, res) {
    assert(req.body, patchUserPassword);

    const { currentPassword, newPassword } = req.body;
    //로그인된 유저 확인
    const loginUser = req.user;
    if (!loginUser) {
      throw new UnauthorizedError('해당 유저가 없습니다.');
    }

    //기존 정보
    const user = await prisma.user.findUnique({
      where: { id: loginUser.id },
    });
    //현재 비밀번호 검증
    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) throw new ValidationError('비밀번호가 일치하지 않습니다.');

    //새 비밀번호 해싱
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(newPassword, salt);

    await prisma.user.update({
      where: { id: loginUser.id },
      data: { password: hashed },
    });

    res.status(200).send({ message: '비밀번호가 변경되었습니다.' });
  }
  //자신이 등록한 상품 목록 조회 GET
  async getMyProduct(req, res) {
    //로그인된 유저 확인
    const loginUser = req.user;
    if (!loginUser) {
      throw new UnauthorizedError('해당 유저가 없습니다.');
    }

    //등록한 상품 목록 조회
    const products = await prisma.product.findMany({
      where: {
        userId: loginUser.id,
      },
    });

    return res.status(200).send(products);
  }

  //자신이 좋아요한 상품 목록 조회
  async getLikedProducts(req, res) {
    const userId = req.user.id;

    const existingLike = await prisma.like.findFirst({
      where: { userId },
    });

    if (userId !== existingLike.userId) {
      throw new ForbiddenError('본인만 접근할 수 있습니다.');
    }

    //좋아요테이블에서 유저가 좋아요 한 상품 목록 조회
    const likes = await prisma.like.findMany({
      where: {
        userId,
        productId: { not: null },
      },
      select: {
        productId: true,
      },
    });

    //좋아요한 상품이없으면 빈 배열 반환
    if (likes.length === 0) return res.send([]);

    //productId 목록 추출
    const productIds = likes.map((list) => list.productId);

    //상품 정보 가져오기
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    //모두 isLiked = true 붙임
    const response = products.map((product) => ({
      ...product,
      isLiked: true,
    }));
    res.send(response);
  }
}

export default new UserController();
