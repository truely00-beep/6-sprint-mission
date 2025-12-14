import { prisma } from '../lib/prismaClient.js';


/** ProductLike */

export function findProductLike(userId, productId) {
  return prisma.productLike.findUnique({
    where:{
      userId_productId:{
        userId: Number(userId),
        productId: Number(productId)
      }
    }
  });
}

export function createProductLike(userId, productId) {
  return prisma.productLike.create({
    data: {
      user: { connect: { id: Number(userId) }},
      product: { connect: { id: Number(productId) }}
    }
  });
}

export function deleteProductLike(userId, productId) {
  return prisma.productLike.delete({
    where: {
      userId_productId: {
        userId: Number(userId),
        productId: Number(productId)
      }
    }
  });
}


/** ArticleLike */

export function findArticleLike(userId, articleId) {
  return prisma.articleLike.findUnique({
    where: {
      userId_articleId: {
        userId: Number(userId),
        articleId: Number(articleId)
      }
    }
  })
}

export function createArticleLike(userId, articleId) {
  return prisma.articleLike.create({
    data: {
      user: { connect: { id: Number(userId) }},
      article: { connect: { id: Number(articleId) }}
    }
  })
}

export function deleteArticleLike(userId, articleId) {
  return prisma.articleLike.delete({
    where: {
      userId_articleId: {
        userId: Number(userId),
        articleId: Number(articleId)
      }
    }
  })
}