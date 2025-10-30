import express from 'express';
import { prisma } from '../utils/prisma.js';
import { validatePagination } from '../middlewares/paginationValidator.js';

const router = express.Router();

router
  .route('/')
  .post(async (req, res) => {
    const data = req.body;
    const article = await prisma.article.create({
      data,
    });
    res.status(201).send(article);
  })
  .get(validatePagination, async (req, res) => {
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
  });

// id 사용하는 API
router
  .route('/:id')
  .get(async (req, res) => {
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
  })
  .patch(async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    const article = await prisma.article.update({
      where: { id },
      data,
    });
    res.status(200).send(article);
  })
  .delete(async (req, res) => {
    const { id } = req.params;
    const article = await prisma.article.delete({
      where: { id },
    });
    res.status(200).send(article);
  });

export default router;
