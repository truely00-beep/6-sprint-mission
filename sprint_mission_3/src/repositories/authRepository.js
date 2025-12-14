import { prisma } from '../lib/prismaClient.js';

export function findUserByEmail(email, options = {}) {
  return prisma.user.findUnique({
    where: { email },
    ...options
  });
}

export function createUser(data) {
  return prisma.user.create({ data }) 
  // key값을 data로 하고 축약된 값 원래는 {data: data(파라미터)}
}
// 원래는 이건데 return prisma.user.create({ data })로 축약된거다.
// return prisma.user.create({ 
//   data: {
//     email, 
//     nickname, 
//     password
//   }
// })


export function findUserById(id, options = {}) {
  return prisma.user.findUnique({
    where: { id: Number(id) },
    ...options
  });
}