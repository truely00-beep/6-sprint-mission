import { prisma } from '../utils/prismaClient.js';

export class Like {
  static toggleProductLike = async (req, res) => {
    const productId = parseInt(req.params.productId, 10);
    const user = req.user;

    const isLikedProduct = await prisma.like.findFirst({
      where: {
        userId: user.id,
        productId: productId,
        articleId: null,
      },
    });
    if (isLikedProduct) {
      await prisma.like.delete({
        where: { id: isLikedProduct.id },
      });
      res.status(200).send({ message: '좋아요가 취소되었습니다.' });
    } else {
      const newLike = await prisma.like.create({
        data: {
          user: { connect: { id: user.id } },
          product: { connect: { id: productId } },
        },
      });
      res.status(201).send({ message: '좋아요를 눌렀습니다.', data: newLike });
    }
  };

  static toggleArticleLike = async (req, res) => {
    const articleId = parseInt(req.params.articleId, 10);
    const user = req.user;

    const isLikedArticle = await prisma.like.findFirst({
      where: {
        userId: user.id,
        productId: null,
        articleId: articleId,
      },
    });

    if (isLikedArticle) {
      await prisma.like.delete({ where: { id: isLikedArticle.id } });
      res.status(200).send({ message: '좋아요가 취소되었습니다.' });
    } else {
      const newLike = await prisma.like.create({
        data: {
          user: { connect: { id: user.id } },
          article: { connect: { id: articleId } },
        },
      });
      res.status(201).send({ message: '좋아요를 눌렀습니다.', data: newLike });
    }
  };
}
