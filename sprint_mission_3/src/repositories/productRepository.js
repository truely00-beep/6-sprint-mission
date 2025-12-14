import { prisma } from '../lib/prismaClient.js'


export function createProduct(data) {
  // data: { 파라미터로 들어온 객체 }
  return prisma.product.create({ data });
  // key값을 data로 하고 축약된 값 그래서 {data: data(파라미터로 들어온 값)}
}
// create에는 where는 필요 없다.

//   data: {
//     name: '축구공',
//     description: '손흥민 축구공',
//     price: 30000,
//     tags: "SPORTS"
//   }

export function findProductById(id, options = {}) {
  return prisma.product.findUnique({
    where: { id: Number(id) },
    ...options
  });
}

export function updateProduct(id, data) {
  return prisma.product.update({
    where: { id : Number(id) },
    data,
  });
}

export function deleteProduct(id) {
  return prisma.product.delete({
    where: { id: Number(id) }
  });
}

export function findProducts(options = {}) {
  return prisma.product.findMany(options)
}