import { create } from 'superstruct';
import { prismaClient } from '../lib/prismaClient.js';
import NotFoundError from '../lib/errors/NotFoundError.js';
import UnauthorizedError from '../lib/errors/UnauthorizedError.js';
import { IdParamsStruct } from '../structs/commonStructs.js';
import {
  CreateArticleBodyStruct,
  UpdateArticleBodyStruct,
  GetArticleListParamsStruct,
} from '../structs/articlesStructs.js';
import { CreateCommentBodyStruct, GetCommentListParamsStruct } from '../structs/commentsStruct.js';

export async function createArticle(req, res) {
  const userId = req.userId;
  const data = create(req.body, CreateArticleBodyStruct);

  const article = await prismaClient.article.create({ data: { ...data, userId } });

  return res.status(201).send(article);
}

export async function getArticle(req, res) {
  const { id } = create(req.params, IdParamsStruct);
  const userId = req.userId;

  const article = await prismaClient.article.findUnique({ where: { id } });
  if (!article) {
    throw new NotFoundError('article', id);
  }

  let isLiked = false;
  if (userId) {
    const like = await prismaClient.like.findFirst({
      where: { userId, articleId: id },
    });
    isLiked = !!like;
  }

  return res.send({ ...article, isLiked });
}

export async function updateArticle(req, res) {
  const userId = req.userId;
  const { id } = create(req.params, IdParamsStruct);
  const data = create(req.body, UpdateArticleBodyStruct);

  const existingArticle = await prismaClient.article.findUnique({ where: { id } });
  if (!existingArticle) {
    throw new NotFoundError('article', id);
  }

  if (existingArticle.userId !== userId) {
    throw new UnauthorizedError('게시글을 수정할 권한이 없습니다.');
  }

  const article = await prismaClient.article.update({ where: { id }, data });

  return res.send(article);
}

export async function deleteArticle(req, res) {
  const userId = req.userId;
  const { id } = create(req.params, IdParamsStruct);

  const existingArticle = await prismaClient.article.findUnique({ where: { id } });
  if (!existingArticle) {
    throw new NotFoundError('article', id);
  }

  if (existingArticle.userId !== userId) {
    throw new UnauthorizedError('게시글을 삭제할 권한이 없습니다.');
  }

  await prismaClient.article.delete({ where: { id } });

  return res.status(204).send();
}

export async function getArticleList(req, res) {
  const { page, pageSize, orderBy, keyword } = create(req.query, GetArticleListParamsStruct);
  const userId = req.userId;

  const where = {
    title: keyword ? { contains: keyword } : undefined,
  };

  const totalCount = await prismaClient.article.count({ where });
  const articles = await prismaClient.article.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: orderBy === 'recent' ? { createdAt: 'desc' } : { id: 'asc' },
    where,
  });

  let articleIds = [];
  let likedArticles = new Set();
  if (userId && articles.length > 0) {
    articleIds = articles.map((a) => a.id);
    const likes = await prismaClient.like.findMany({
      where: {
        userId,
        articleId: { in: articleIds },
      },
    });
    likedArticles = new Set(likes.map((like) => like.articleId));
  }

  const articlesWithLiked = articles.map((article) => ({
    ...article,
    isLiked: userId ? likedArticles.has(article.id) : false,
  }));

  return res.send({
    list: articlesWithLiked,
    totalCount,
  });
}

export async function createComment(req, res) {
  const userId = req.userId;
  const { id: articleId } = create(req.params, IdParamsStruct);
  const { content } = create(req.body, CreateCommentBodyStruct);

  const existingArticle = await prismaClient.article.findUnique({ where: { id: articleId } });
  if (!existingArticle) {
    throw new NotFoundError('article', articleId);
  }

  const comment = await prismaClient.comment.create({
    data: {
      articleId,
      content,
      userId,
    },
  });

  return res.status(201).send(comment);
}

export async function getCommentList(req, res) {
  const { id: articleId } = create(req.params, IdParamsStruct);
  const { cursor, limit } = create(req.query, GetCommentListParamsStruct);

  const article = await prismaClient.article.findUnique({ where: { id: articleId } });
  if (!article) {
    throw new NotFoundError('article', articleId);
  }

  const commentsWithCursor = await prismaClient.comment.findMany({
    cursor: cursor ? { id: cursor } : undefined,
    take: limit + 1,
    where: { articleId },
    orderBy: { createdAt: 'desc' },
  });
  const comments = commentsWithCursor.slice(0, limit);
  const cursorComment = commentsWithCursor[commentsWithCursor.length - 1];
  const nextCursor = cursorComment ? cursorComment.id : null;

  return res.send({
    list: comments,
    nextCursor,
  });
}
