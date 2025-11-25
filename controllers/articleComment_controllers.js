import { prisma } from '../lib/prismaclient.js';

export async function articleCommentNew(req, res) {
  const articleId = req.params.articleId;
  const article = await prisma.article.findUnique({ where: { id: articleId } });

  if (!article)
    return res.status(404).json({ message: 'Cannot found article' });

  const { content } = req.body;
  const commentCreate = await prisma.commentArticle.create({
    data: {
      content,
      article: {
        connect: { id: articleId },
      },
    },
    include: {
      article: true,
    },
  });

  res.status(201).json(commentCreate);
}

export async function articleCommentsList(req, res) {
  const articleId = req.params.articleId;
  const article = await prisma.article.findUnique({ where: { id: articleId } });

  if (!article)
    return res.status(404).json({ message: 'Cannot found article' });

  const articleComments = await prisma.article.findUnique({
    where: { id: articleId },
    include: {
      comments: {
        select: {
          id: true,
          content: true,
          createdAt: true,
        },
      },
    },
  });

  if (!articleComments)
    return res.status(404).json({ message: 'Cannot found Article comment' });

  res.status(200).json(articleComments.comments);
}

export async function articleCommentUpdate(req, res) {
  const articleId = req.params.articleId;
  const article = await prisma.article.findUnique({ where: { id: articleId } });

  if (!article)
    return res.status(404).json({ message: 'Cannot found article' });

  const commentId = req.params.commentId;
  const comment = await prisma.commentArticle.findUnique({
    where: { id: articleId },
  });

  if (!comment)
    return res.status(404).json({ message: 'Cannot found comment' });

  const commentUpdate = await prisma.commentArticle.update({
    where: { id: commentId },
    data: req.body,
  });

  res.status(201).json(commentUpdate);
}

export async function articleCommentDelete(req, res) {
  const articleId = req.params.articleId;
  const article = await prisma.article.findUnique({ where: { id: articleId } });

  if (!article)
    return res.status(404).json({ message: 'Cannot found article' });

  const commentId = req.params.commentId;
  const comment = await prisma.commentArticle.findUnique({
    where: { id: articleId },
  });

  if (!comment)
    return res.status(404).json({ message: 'Cannot found comment' });

  await prisma.commentArticle.delete({
    where: { id: commentId },
  });

  res.status(204).json(commentId);
}
