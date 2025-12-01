import { create } from 'superstruct';
import { prismaClient } from '../lib/prismaClient.js';
import {
  UpdatePasswordBodyStruct,
  UpdateMeBodyStruct,
  GetProductListParamsStruct,
} from '../structs/usersStructs.js';

// 유저가 자신의 정보를 조회하는 기능을 구현합니다
export function getMe(req, res) {
  const { password: _, ...userWithoutPassword } = req.user;
  res.send(userWithoutPassword);
}

// 유저가 자신의 정보를 수정할 수 있는 기능을 구현합니다.
export function updateMe(req, res) {
  const data = create(req.body, UpdateMeBodyStruct);
  const updatedUser = prismaClient.user.update({
    where: { id: req.user.id },
    data,
  });
  const { password: _, ...userWithoutPassword } = updatedUser;
  res.send(userWithoutPassword);
}

// 유저가 자신의 비밀번호를 변경할 수 있는 기능을 구현합니다.
export async function updateMyPassword(req, res) {
  const { password, newPassword } = create(req.body, UpdatePasswordBodyStruct);

  const user = await prismaClient.user.findUnique({ where: { id: req.user.id } });
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new BadRequestError('현재 비밀번호가 올바르지 않습니다.');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  await prismaClient.user.update({
    where: { id: req.user.id },
    data: { password: hashedPassword },
  });

  res.status(200).send();
}

// 유저가 자신이 등록한 상품의 목록을 조회하는 기능을 구현합니다.
export async function getMyProductList(req, res) {
  const { page, pageSize, orderBy, keyword } = create(req.query, GetProductListParamsStruct);

  const where = keyword
    ? {
        OR: [{ name: { contains: keyword } }, { description: { contains: keyword } }],
      }
    : undefined;
  const totalCount = await prismaClient.product.count({ where });
  const products = await prismaClient.product.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: orderBy === 'recent' ? { id: 'desc' } : { id: 'asc' },
    where: { ...where, userId: req.user.id },
  });

  res.send({ products, totalCount });
}
