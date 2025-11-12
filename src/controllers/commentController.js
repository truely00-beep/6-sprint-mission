import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const createProductComment = async (req, res) => {
  const { content } = req.body;
  const { id } = req.params;

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product)
    return res.status(404).json({ message: '상품을 찾을 수 없습니다.' });

  const comment = await prisma.comment.create({
    data: { content, productId: id },
  });
  res.status(201).json(comment);
};

export const createArticleComment = async (req, res) => {
  const { content } = req.body;
  const { id } = req.params;

  const article = await prisma.article.findUnique({ where: { id } });
  if (!article)
    return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });

  const comment = await prisma.comment.create({
    data: { content, articleId: id },
  });
  res.status(201).json(comment);
};

export const getProductComments = async (req, res) => {
  const { id } = req.params;
  const { cursor, limit = 10 } = req.query;

  const comments = await prisma.comment.findMany({
    where: { productId: id },
    take: parseInt(limit),
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: { createdAt: 'desc' },
  });

  res.json(comments);
};

export const getArticleComments = async (req, res) => {
  const { id } = req.params;
  const { cursor, limit = 10 } = req.query;

  const comments = await prisma.comment.findMany({
    where: { articleId: id },
    take: parseInt(limit),
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: { createdAt: 'desc' },
  });

  res.json(comments);
};

export const updateComment = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  const updated = await prisma.comment.update({
    where: { id },
    data: { content },
  });
  res.json(updated);
};

export const deleteComment = async (req, res) => {
  const { id } = req.params;
  await prisma.comment.delete({ where: { id } });
  res.sendStatus(204);
};
