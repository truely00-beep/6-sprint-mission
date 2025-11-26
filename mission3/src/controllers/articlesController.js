import { create } from 'superstruct';
import { prisma } from '../lib/prismaClient.js';
import { NotFoundError, UnauthorizedError } from '../lib/errors/customErrors.js';
import { IdParamsStruct } from '../structs/commonStructs.js';
import {
  CreateArticleBodyStruct,
  UpdateArticleBodyStruct,
  GetArticleListParamsStruct,
} from '../structs/articlesStructs.js';
import { CreateCommentBodyStruct, GetCommentListParamsStruct } from '../structs/commentsStruct.js';

//게시물 생성
export async function createArticle(req, res) {
  const { title, content, image } = create(req.body, CreateArticleBodyStruct);
  const user = req.user;
  const article = await prisma.article.create({ data: { title, content, image, userId: user.id } });
  return res.status(201).send(article);
}

export async function getArticle(req, res) {
  const { id } = create(req.params, IdParamsStruct);

  const article = await prisma.article.findUnique({ where: { id } });
  if (!article) {
    throw new NotFoundError('article', id);
  }

  return res.send(article);
}
//게시물 수정
export async function updateArticle(req, res) {
  const { id } = create(req.params, IdParamsStruct);
  const data = create(req.body, UpdateArticleBodyStruct);
  const user = req.user;
  const article = await prisma.article.findUniqueOrThrow({ where: { id } });
  if (article.userId !== user.id) {
    throw new UnauthorizedError();
  }
  const updateArticle = await prisma.article.update({ where: { id }, data });
  return res.send(updateArticle);
}
//게시물 삭제
export async function deleteArticle(req, res) {
  const { id } = create(req.params, IdParamsStruct);
  const user = req.user;
  const article = await prisma.article.findUniqueOrThrow({ where: { id } });
  if (article.userId !== user.id) {
    throw new UnauthorizedError();
  }
  await prisma.article.delete({ where: { id } });
  return res.status(204).send();
}

export async function getArticleList(req, res) {
  const { page, pageSize, orderBy, keyword } = create(req.query, GetArticleListParamsStruct);

  const where = {
    title: keyword ? { contains: keyword } : undefined,
  };

  const totalCount = await prisma.article.count({ where });
  const articles = await prisma.article.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: orderBy === 'recent' ? { createdAt: 'desc' } : { id: 'asc' },
    where,
  });

  return res.send({
    list: articles,
    totalCount,
  });
}
//댓글 등록
export async function createComment(req, res) {
  const { id: articleId } = create(req.params, IdParamsStruct);
  const { content } = create(req.body, CreateCommentBodyStruct);
  const user = req.user;
  await prisma.article.findUniqueOrThrow({ where: { id: articleId } });
  const comment = await prisma.comment.create({
    data: {
      articleId,
      content,
      userId: user.id,
    },
  });

  return res.status(201).send(comment);
}

export async function getCommentList(req, res) {
  const { id: articleId } = create(req.params, IdParamsStruct);
  const { cursor, limit } = create(req.query, GetCommentListParamsStruct);

  const article = await prisma.article.findUnique({ where: { id: articleId } });
  if (!article) {
    throw new NotFoundError('article', articleId);
  }

  const commentsWithCursor = await prisma.comment.findMany({
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

export async function likeArticle(req, res) {
  const { id } = create(req.params, IdParamsStruct);
  const user = req.user;
  const article = await prisma.article.findUniqueOrThrow({ where: { id } });
  const existingLike = await prisma.articleLike.findUnique({
    where: {
      userId_articleId: {
        userId: user.id,
        articleId: article.id,
      },
    },
  });
  if (existingLike) {
    return res.status(400).send({ message: '이미 좋아요를 눌렀습니다.' });
  }
  await prisma.articleLike.create({
    data: {
      userId: user.id,
      articleId: article.id,
    },
  });
  return res.status(200).send({ message: '게시물이 성공적으로 좋아요되었습니다.' });
}
