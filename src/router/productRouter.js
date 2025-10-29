import express from 'express';
import { PrismaClient } from '@prisma/client';
import { assert } from 'superstruct';
import { CreateProduct, PatchProduct } from '../structs/productStructs.js';
import { asyncHandler } from '../handlerFn.js';
import cors from 'cors';

const prisma = new PrismaClient();
const productRouter = express.Router();

const app = express();
app.use(cors());
app.use(express.json());

productRouter
  .route('/')
  .get(
    asyncHandler(async (req, res) => {
      const { offset = 0, limit = 10, order = 'newest', search = '' } = req.query;
      let orderBy;
      switch (order) {
        case 'oldest':
          orderBy = { createdAt: 'asc' };
          break;
        case ' newest':
        default:
          orderBy = { createdAt: 'desc' };
      }

      const where = search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {};

      const products = await prisma.product.findMany({
        where,
        orderBy,
        skip: parseInt(offset),
        take: parseInt(limit),
      });
      res.send(products);
    }),
  )
  .post(
    asyncHandler(async (req, res) => {
      assert(req.body, CreateProduct);

      const products = await prisma.product.create({
        data: req.body,
      });
      res.status(201).send(products);
    }),
  );

productRouter
  .route('/:id')
  .get(
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      const products = await prisma.product.findUnique({
        where: { id },
      });
      if (products) {
        res.send(products);
      } else {
        res.status(404).send({ message: 'Cannot find given id' });
      }
    }),
  )
  .patch(
    asyncHandler(async (req, res) => {
      assert(req.body, PatchProduct);

      const { id } = req.params;
      const products = await prisma.product.update({
        where: { id },
        data: req.body,
      });
      res.send(products);
    }),
  )
  .delete(
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      const products = await prisma.product.delete({
        where: { id },
      });
      res.sendStatus(204);
    }),
  );

export default productRouter;
