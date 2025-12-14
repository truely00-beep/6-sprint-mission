import { prisma } from '../lib/prismaClient.js';

export function findUserById(id, options = {}) {
  return prisma.user.findUnique({
    where: { id: Number(id) },
    ...options
  })
}

export function updateUserById(id, data, options = {}) { //options는 select: {} 이게 들어온다.
  return prisma.user.update({
    where: { id: Number(id) },
    data,
    ...options,
  })
}
// 이렇게 들어온다.

// 유저가 자신의 정보를 수정 과정에서의 진행 코드
// prisma.user.update({
//   where: { id: 1 },
//   data: { nickname: "철수", email: "charles@gmail.com" },
//   select: {
//     email: true,
//     nickname: true
//   }
// });


// 유저가 자신의 비밀번호를 변경 과정에서의 진행 코드
// prisma.user.update({
//   where: { id: 1 },
//   data: {
//     password: hashedPassword
//   }
// });