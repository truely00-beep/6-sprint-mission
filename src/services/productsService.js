import { prisma } from '../utils/prisma.js';

async function createProductInDb(productData) {
  return prisma.product.create({
    data: {
      name: productData.name,
      description: productData.description,
      price: productData.price,
      tags: productData.tags,
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
    },
  });
}

async function updateProductInDb(id, updateData) {
  return prisma.product.update({
    where: { id },
    data: updateData,
  });
}

async function deleteProductInDb(id) {
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
