import ValidationError from '../lib/errors/ValidationError';
import prisma from '../lib/prisma';
import { Request, Response } from 'express';

class LikeController {
  async toggleLike(req: Request, res: Response) {
    if (!req.user) {
      throw new ValidationError('로그인이 필요합니다.');
    }
    const userId = req.user.id;

    const targetId = req.params.id;

    if (!targetId) throw new ValidationError('유효하지 않은 targetId입니다.');

    // console.log('baseUrl:', req.baseUrl);
    // console.log('path:', req.path);
    // console.log('originalUrl:', req.originalUrl);

    //어떤 라우터로 들어왔는지 확인 - /products/1/like
    const type = req.baseUrl.includes('/products') ? 'Product' : 'Article';

    //기존 좋아요 여부 확인
    let existing;
    if (type === 'Product') {
      existing = await prisma.productLike.findFirst({
        where: {
          userId,
          productId: Number(targetId),
        },
        select: { id: true },
      });
    } else {
      existing = await prisma.articleLike.findFirst({
        where: {
          userId,
          articleId: Number(targetId),
        },
        select: { id: true },
      });
    }

    let isLiked = false;

    await prisma.$transaction(async (tx) => {
      if (existing) {
        //좋아요 취소
        if (type === 'Product') {
          await tx.productLike.delete({
            where: { id: existing.id },
          });
        } else {
          await tx.articleLike.delete({
            where: { id: existing.id },
          });
        }

        //카운트 감소
        if (type === 'Product') {
          await tx.product.update({
            where: { id: Number(targetId) },
            data: { likeCount: { decrement: 1 } },
          });
        } else {
          await tx.article.update({
            where: { id: Number(targetId) },
            data: { likeCount: { decrement: 1 } },
          });
        }
      } else {
        //좋아요 등록
        if (type === 'Product') {
          await tx.productLike.create({
            data: {
              userId,
              productId: Number(targetId), //상품에 좋아요 누를 경우
            },
          });
        } else {
          await tx.articleLike.create({
            data: {
              userId,
              articleId: Number(targetId), //게시글에 좋아요 누를 경우
            },
          });
        }

        // 좋아요 카운트 증가
        if (type === 'Product') {
          await tx.product.update({
            where: { id: Number(targetId) },
            data: { likeCount: { increment: 1 } },
          });
        } else {
          await tx.article.update({
            where: { id: Number(targetId) },
            data: { likeCount: { increment: 1 } },
          });
        }

        isLiked = true;
      }
    });

    return res.status(200).send({
      message: isLiked ? '좋아요 등록됨' : '좋아요 해제됨',
      isLiked,
    });
  }
}

export default new LikeController();
