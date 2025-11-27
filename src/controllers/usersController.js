import { usersService } from '../services/usersService.js';

export async function getMyInfo(req, res) {
  const userId = req.user.id;

  const user = await usersService.getUserById(userId);

  res.status(200).json(user);
}

export async function updateMyInfo(req, res) {
  const userId = req.user.id;
  const { nickname, image } = req.body;

  if (!nickname && !image) {
    const error = new Error('수정할 내용이 없습니다.');
    error.status = 400;
    throw error;
  }

  const updatedUser = await usersService.updateUser(userId, { nickname, image });

  res.status(200).json({
    message: '내 정보가 수정되었습니다.',
    data: updatedUser,
  });
}

export async function updatePassword(req, res) {
  const userId = req.user.id;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    const error = new Error('현재 비밀번호와 새 비밀번호를 모두 입력해주세요.');
    error.status = 400;
    throw error;
  }

  await usersService.changePassword(userId, currentPassword, newPassword);

  res.status(200).json({
    message: '비밀번호가 변경되었습니다. 다시 로그인해주세요.',
  });
}

export async function getMyProducts(req, res) {
  const userId = req.user.id;

  const products = await usersService.getUserProducts(userId);

  res.status(200).json({
    message: '내가 등록한 상품 목록을 조회했습니다.',
    data: products,
  });
}
