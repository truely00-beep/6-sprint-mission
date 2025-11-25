import { prisma } from '../utils/prisma.js';

async function createProductInDb(productData, userId) {
  return prisma.product.create({
    data: {
      name: productData.name,
      description: productData.description,
      price: productData.price,
      tags: productData.tags,
      userId,
    },
  });
}

async function findProducts({ sort, search, offset, limit }) {
  const orderBy = sort === 'resent' ? { createdAt: 'desc' } : { createdAt: 'asc' };

  const where = {};
  if (search) {
    where.OR = [{ name: { contains: search } }, { description: { contains: search } }];
  }

  const [products, totalProducts] = await Promise.all([
    prisma.product.findMany({
      select: {
        id: true,
        name: true,
        price: true,
        createdAt: true,
      },
      where,
      orderBy,
      skip: offset,
      take: limit,
    }),
    prisma.product.count({
      where,
    }),
  ]);

  return { products, totalProducts };
}

async function findProductById(id) {
  return prisma.product.findUniqueOrThrow({
    where: { id },
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      tags: true,
      createdAt: true,
      user: {
        select: {
          id: true,
          nickname: true,
          email: true,
        },
      },
    },
  });
}

async function updateProductInDb(id, updateData, userId) {
  const product = await prisma.product.findUniqueOrThrow({ where: { id } });

  if (product.userId !== userId) {
    const error = new Error('수정 권한이 없습니다.');
    error.status = 403;
    throw error;
  }

  return prisma.product.update({
    where: { id },
    data: updateData,
  });
}

async function deleteProductInDb(id, userId) {
  const product = await prisma.product.findUniqueOrThrow({ where: { id } });

  if (product.userId !== userId) {
    const error = new Error('삭제 권한이 없습니다.');
    error.status = 403;
    throw error;
  }

  return prisma.product.delete({
    where: { id },
  });
}

export const productsService = {
  createProductInDb,
  findProducts,
  findProductById,
  updateProductInDb,
  deleteProductInDb,
};
