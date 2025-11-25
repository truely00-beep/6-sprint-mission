import { prisma } from '../utils/prisma.js';

async function createArticleInDb(title, content, userId) {
  return prisma.article.create({
    data: {
      title: title,
      content: content,
      userId,
    },
  });
}

async function findArticles({ sort, search, offset, limit }) {
  const orderBy = sort === 'resent' ? { createdAt: 'desc' } : { createdAt: 'asc' };

  const where = {};
  if (search) {
    where.OR = [{ title: { contains: search } }, { content: { contains: search } }];
  }

  const [articles, totalArticles] = await Promise.all([
    prisma.article.findMany({
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
      },
      where,
      orderBy,
      skip: offset,
      take: limit,
    }),
    prisma.article.count({
      where,
    }),
  ]);

  return { articles, totalArticles };
}

async function findArticleById(id) {
  return prisma.article.findUniqueOrThrow({
    where: { id },
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
      user: {
        select: {
          id: true,
          nickname: true,
          email: true,
        },
      },
    },
  });
}

async function updateArticleInDb(id, updateData, userId) {
  const article = await prisma.article.findUniqueOrThrow({ where: { id } });

  if (article.userId !== userId) {
    const error = new Error('수정 권한이 없습니다.');
    error.status = 403;
    throw error;
  }

  return prisma.article.update({
    where: { id },
    data: updateData,
  });
}

async function deleteArticleInDb(id, userId) {
  const article = await prisma.article.findUniqueOrThrow({ where: { id } });

  if (article.userId !== userId) {
    const error = new Error('삭제 권한이 없습니다.');
    error.status = 403;
    throw error;
  }

  return prisma.article.delete({
    where: { id },
  });
}

export const articlesService = {
  createArticleInDb,
  findArticles,
  findArticleById,
  updateArticleInDb,
  deleteArticleInDb,
};
