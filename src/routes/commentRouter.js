import express from 'express';
import { PrismaClient } from '@prisma/client';
import {
  validateComment,
  validateUpdateComment,
} from '../middlewares/validate/validateComment.js';
import { asyncHandler } from '../middlewares/errorHandler/asyncHandler.js';
import {
  validateProductIdParam,
  validateArticleIdParam,
  validateIdParam,
} from '../middlewares/validate/validateId.js';

const router = express.Router();
const prisma = new PrismaClient();

router
  .route('/product/:productId')
  .post(
    validateProductIdParam,
    validateComment,
    asyncHandler(async (req, res) => {
      const { productId } = req.params;
      const { content } = req.body;
      const data = await prisma.comment.create({
        data: { content, productId },
      });
      res.status(201).json(data);
    })
  )
  .get(
    validateProductIdParam,
    asyncHandler(async (req, res) => {
      const { productId } = req.params;
      const cursor = req.query.cursor;
      const take = parseInt(req.query.take) || 10;

      const data = await prisma.comment.findMany({
        where: { productId },
        take: take,
        skip: cursor ? 1 : 0,
        ...(cursor ? { cursor: { id: cursor } } : {}),
        orderBy: { createdAt: 'desc' },
        select: { id: true, content: true, createdAt: true },
      });

      if (data.length === 0) {
        return res
          .status(404)
          .json({ message: '아직 댓글이 존재하지 않습니다.' });
      }

      res.status(200).json(data);
    })
  );

router
  .route('/article/:articleId')
  .post(
    validateArticleIdParam,
    validateComment,
    asyncHandler(async (req, res) => {
      const { articleId } = req.params;
      const { content } = req.body;
      const data = await prisma.comment.create({
        data: { articleId, content },
      });
      res.status(201).json(data);
    })
  )
  .get(
    validateArticleIdParam,
    asyncHandler(async (req, res) => {
      const { articleId } = req.params;
      const cursor = req.query.cursor;
      const take = parseInt(req.query.take) || 10;

      const data = await prisma.comment.findMany({
        where: { articleId },
        take: take,
        skip: cursor ? 1 : 0,
        ...(cursor ? { cursor: { id: cursor } } : {}),
        orderBy: { createdAt: 'desc' },
        select: { id: true, content: true, createdAt: true },
      });

      if (data.length === 0) {
        return res
          .status(404)
          .json({ message: '아직 댓글이 존재하지 않습니다.' });
      }

      res.status(200).json(data);
    })
  );

router
  .route('/:id')
  .patch(
    validateIdParam,
    validateUpdateComment,
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      const data = await prisma.comment.update({
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
      const data = await prisma.comment.delete({
        where: { id },
      });
      res.status(204).json(data);
    })
  );

export default router;
