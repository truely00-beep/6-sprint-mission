import express from 'express';
import { PrismaClient } from '@prisma/client';
import {
  validateArticle,
  validateUpdateArticle,
} from '../middlewares/validate/validateArticle.js';
import { asyncHandler } from '../middlewares/errorHandler/asyncHandler.js';
import { validateIdParam } from '../middlewares/validate/validateId.js';

const router = express.Router();
const prisma = new PrismaClient();

router
  .route('/')
  .post(
    validateArticle,
    asyncHandler(async (req, res) => {
      const data = await prisma.article.create({
        data: req.body,
      });
      res.status(201).json(data);
    })
  )
  .get(
    asyncHandler(async (req, res) => {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search || '';
      const skip = (page - 1) * limit;
      const sort = req.query.sort || 'recent';

      const where = search
        ? {
            OR: [
              { title: { contains: search, mode: 'insensitive' } },
              { content: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {};

      const orderBy = { createdAt: sort === 'recent' ? 'desc' : 'asc' };

      const data = await prisma.article.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        select: { id: true, title: true, content: true, createdAt: true },
      });
      res.status(200).json(data);
    })
  );

router
  .route('/:id')
  .get(
    validateIdParam,
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      const data = await prisma.article.findUnique({
        where: { id },
        select: { id: true, title: true, content: true, createdAt: true },
      });

      if (!data) {
        return res
          .status(404)
          .json({ message: '해당 게시글을 찾을 수 없습니다.' });
      }

      res.status(200).json(data);
    })
  )
  .patch(
    validateIdParam,
    validateUpdateArticle,
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      const data = await prisma.article.update({
        where: { id },
        data: req.body,
      });
      res.status(200).json(data);
    })
  )
  .delete(
    validateIdParam,
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      const data = await prisma.article.delete({
        where: { id },
      });
      res.status(204).json(data);
    })
  );

export default router;
