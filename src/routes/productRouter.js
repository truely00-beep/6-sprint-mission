import express from 'express';
import { PrismaClient } from '@prisma/client';
import {
  validateProduct,
  validateUpdateProduct,
} from '../middlewares/validate/validateProduct.js';
import { asyncHandler } from '../middlewares/errorHandler/asyncHandler.js';
import { validateIdParam } from '../middlewares/validate/validateId.js';

const router = express.Router();
const prisma = new PrismaClient();

router
  .route('/')
  .post(
    validateProduct,
    asyncHandler(async (req, res) => {
      const data = await prisma.product.create({
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
      const sort = req.query.sort || 'recent';
      const skip = (page - 1) * limit;

      const where = search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {};

      const orderBy = { createdAt: sort === 'recent' ? 'desc' : 'asc' };

      const data = await prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        select: { id: true, name: true, price: true, createdAt: true },
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
      const data = await prisma.product.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          tags: true,
          createdAt: true,
        },
      });

      if (!data) {
        return res
          .status(404)
          .json({ message: '해당 상품을 찾을 수 없습니다.' });
      }

      res.status(200).json(data);
    })
  )
  .patch(
    validateIdParam,
    validateUpdateProduct,
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      const data = await prisma.product.update({
        where: { id },
        data: req.body,
      });
      res.status(200).json(data);
    })
  )
  .delete(
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      const data = await prisma.product.delete({
        where: { id },
      });
      res.status(204).json(data);
    })
  );

export default router;
