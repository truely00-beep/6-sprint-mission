import { CreateArticleSchema, PatchArticleSchema } from '../validations/articles.schema.js';
import { validate } from 'superstruct';
import { prisma } from '../utils/prisma.js';
import isUuid from 'is-uuid';

export async function createArticle(req, res, next) {
  const { body } = req;

  const [error, value] = validate(body, CreateArticleSchema);

  if (error) {
    const validationError = new Error(`요청 데이터 형식이 올바르지 않습니다: ${error.message}`);
    validationError.status = 400;
    throw validationError;
  }
  const newArticle = await prisma.article.create({
    data: {
      title: value.title,
      content: value.content,
    },
  });

  res.status(201).json({
    message: '게시글이 성공적으로 등록되었습니다.',
    data: newArticle,
  });
}

export async function getArticles(req, res, next) {
  const { sort, search } = req.query;
  const { offset: _offset, limit: _limit } = req.paginationParams;

  const orderBy = {};

  if (sort === 'recent') {
    orderBy.createdAt = 'desc';
  }

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
      skip: _offset,
      take: _limit,
    }),

    prisma.article.count({
      where,
    }),
  ]);

  if (search && totalArticles === 0) {
    return res.status(200).json({
      message: `${search}와 일치하는 게시물을 찾을 수 없습니다.`,
      data: [],
      pagination: {
        totalItems: 0,
        totalPages: 0,
        currentPage: 1,
        itemsPerPage: _limit,
      },
    });
  }

  const totalPages = Math.ceil(totalArticles / _limit);

  res.status(200).json({
    message: '게시판 목록을 조회했습니다.',
    data: articles,
    pagination: {
      totalItems: totalArticles,
      totalPages: totalPages,
      currentPage: Math.floor(_offset / _limit) + 1,
      itemsPerPage: _limit,
    },
  });
}

export async function getArticle(req, res, next) {
  const { id } = req.params;

  const article = await prisma.article.findUniqueOrThrow({
    where: { id },
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
    },
  });
  res.status(200).send(article);
}

export async function patchArticle(req, res, next) {
  const { id } = req.params;
  const { body } = req;

  const [error, value] = validate(body, PatchArticleSchema);

  if (error) {
    const validationError = new Error(`수정 데이터 형식이 올바르지 않습니다: ${error.message}`);
    validationError.status = 400;
    throw validationError;
  }

  if (Object.keys(value).length === 0) {
    const emptyBodyError = new Error('수정할 내용이 비어 있습니다.');
    emptyBodyError.status = 400;
    throw emptyBodyError;
  }

  const article = await prisma.article.update({
    where: { id },
    data: value,
  });

  res.status(200).json({
    message: '게시글이 성공적으로 수정되었습니다.',
    data: article,
  });
}

export async function deleteArticle(req, res, next) {
  const { id } = req.params;
  const article = await prisma.article.delete({
    where: { id },
  });
  res.status(200).send(article);
}
