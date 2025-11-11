// src/services/commentsService.js

import { prisma } from '../utils/prisma.js';

async function createArticleComment(articleId, content) {
  return prisma.comment.create({
    data: {
      content: content,
      article: { connect: { id: articleId } },
    },
    select: {
      id: true,
      content: true,
      createdAt: true,
      articleId: true,
    },
  });
}

async function createProductComment(productId, content) {
  return prisma.comment.create({
    data: {
      content: content,
      product: { connect: { id: productId } },
    },
    select: {
      id: true,
      content: true,
      createdAt: true,
      productId: true,
    },
  });
}

async function findCommentsByArticleId({ articleId, limit, cursor }) {
  const findOptions = {
    where: { articleId: articleId },
    orderBy: { createdAt: 'desc' },
    take: limit + 1,
    select: {
      id: true,
      content: true,
      createdAt: true,
    },
  };

  if (cursor) {
    findOptions.cursor = { id: cursor };
    findOptions.skip = 1;
  }

  const comments = await prisma.comment.findMany(findOptions);

  let nextCursor = null;
  if (comments.length > limit) {
    nextCursor = comments[limit - 1].id;
    comments.pop();
  }

  return { comments, nextCursor };
}

async function findCommentsByProductId({ productId, limit, cursor }) {
  const findOptions = {
    where: { productId: productId }, // 상품 ID로 필터링
    orderBy: { createdAt: 'desc' },
    take: limit + 1,
    select: {
      id: true,
      content: true,
      createdAt: true,
    },
  };

  if (cursor) {
    findOptions.cursor = { id: cursor };
    findOptions.skip = 1;
  }

  const comments = await prisma.comment.findMany(findOptions);

  let nextCursor = null;
  if (comments.length > limit) {
    nextCursor = comments[limit - 1].id;
    comments.pop();
  }

  return { comments, nextCursor };
}

async function updateCommentInDb(commentId, content) {
  return prisma.comment.update({
    where: { id: commentId },
    data: { content: content },
  });
}

async function deleteCommentInDb(commentId) {
  return prisma.comment.delete({
    where: { id: commentId },
  });
}

export const commentsService = {
  createArticleComment,
  createProductComment,
  findCommentsByArticleId,
  findCommentsByProductId,
  updateCommentInDb,
  deleteCommentInDb,
};
