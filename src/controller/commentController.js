import { prisma } from '../utils/prismaClient.js';

export class commentController {
  static createProductComment = async (req, res) => {
    const { content, product, user } = req.body;

    const productComment = await prisma.comment.create({
      data: {
        content,
        user: {
          connect: {
            // connect >> 레코드를 생성할때 원래 있는 부모 레코드의 필드를 참조,
            // create  >> 포스트 요청시 부모 레코드가 새로 만들어져야 할때  그 필드를 참조할때
            id: user.userId,
          },
        },
        product: {
          connect: {
            id: product.productId,
          },
        },
      },
      select: { id: true, content: true, createdAt: true, productId: true, userId: true },
    });
    res.status(201).send(productComment);
  };
  static createArticleComment = async (req, res) => {
    const { content, article, user } = req.body;
    const articleComment = await prisma.comment.create({
      data: {
        content,
        user: { connect: { id: user.userId } },
        article: { connect: { id: article.articleId } },
      },
      select: { id: true, content: true, createdAt: true, articleId: true, userId: true },
    });
    res.status(201).send(articleComment);
  };
  static patchComment = async (req, res) => {
    const { id } = req.params;
    const patchComment = await prisma.comment.update({
      where: { id },
      data: req.body,
      select: {
        id: true,
        content: true,
        updatedAt: true,
        userId: true,
      },
    });
    res.status(200).send(patchComment);
  };
  static getAllComment = async (req, res) => {
    const { limit = 10, cursorId, page = '1' } = req.query;
    const orderBy = { createdAt: 'desc' };
    const cursor = cursorId ? { id: cursorId } : undefined; //>> undefined 값을 전달할시 해당 옶션은 없는 옵션으로 간주 >> 오류 발생 확률 내려감
    const getAllComment = await prisma.comment.findMany({
      cursor,
      orderBy,
      skip: page === '1' ? 0 : 1,
      take: parseInt(limit),
      select: {
        id: true,
        content: true,
        createdAt: true,
      },
    });
    res.status(200).send(getAllComment);
  };
  static deleteComment = async (req, res) => {
    const { id } = req.params;
    await prisma.comment.delete({
      where: { id },
    });
    res.sendStatus(204);
  };
}
