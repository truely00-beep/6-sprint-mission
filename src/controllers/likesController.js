import { prismaClient } from '../lib/prismaClient.js';
import { IdParamsStruct } from '../structs/commonStructs.js';
import { create } from 'superstruct';
import NotFoundError from '../lib/errors/NotFoundError.js';
import { withAsync } from '../lib/withAsync.js';

export const likeProduct = withAsync(async (req, res) => {
  const userId = req.userId;
  const { id: productId } = create(req.params, IdParamsStruct);

  const product = await prismaClient.product.findUnique({ where: { id: productId } });
  if (!product) {
    throw new NotFoundError('product', productId);
  }

  const existingLike = await prismaClient.favorite.findFirst({
    where: { userId, productId },
  });

  if (existingLike) {
    await prismaClient.favorite.delete({
      where: { id: existingLike.id },
    });
    return res.json({ message: '좋아요가 취소되었습니다.', isLiked: false });
  }

  await prismaClient.favorite.create({
    data: { userId, productId },
  });

  return res.json({ message: '좋아요가 추가되었습니다.', isLiked: true });
});

export const likeArticle = withAsync(async (req, res) => {
  const userId = req.userId;
  const { id: articleId } = create(req.params, IdParamsStruct);

  const article = await prismaClient.article.findUnique({ where: { id: articleId } });
  if (!article) {
    throw new NotFoundError('article', articleId);
  }

  const existingLike = await prismaClient.like.findFirst({
    where: { userId, articleId },
  });

  if (existingLike) {
    await prismaClient.like.delete({
      where: { id: existingLike.id },
    });
    return res.json({ message: '좋아요가 취소되었습니다.', isLiked: false });
  }

  await prismaClient.like.create({
    data: { userId, articleId },
  });

  return res.json({ message: '좋아요가 추가되었습니다.', isLiked: true });
});

export const getLikedProducts = withAsync(async (req, res) => {
  const userId = req.userId;

  const likedProducts = await prismaClient.favorite.findMany({
    where: { userId },
    include: {
      product: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  const products = likedProducts.map((favorite) => ({
    ...favorite.product,
    isLiked: true,
  }));

  return res.json({ products });
});


