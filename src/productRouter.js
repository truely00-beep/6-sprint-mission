import express from 'express';
import { Prisma, PrismaClient } from '@prisma/client';
import { assert } from 'superstruct';
import { PORT } from '../constants.js';
import cors from 'cors';
import { CreateProduct, PatchProduct } from './productStructs.js';

const prisma = new PrismaClient();

const app = express();
app.use(cors());
app.use(express.json());

function asyncHandler(handler) {
  return async function (req, res) {
    try {
      await handler(req, res);
    } catch (e) {
      console.error(e);

      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
        res.sendStatus(404);
      } else if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        res.status(400).send({ message: e.message });
      } else if (e.name === 'StructError') {
        res.status(400).send({ message: e.message });
      } else {
        res.status(500).send({ message: e.message });
      }
    }
  };
}

app.get(
  '/products',
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
);

app.get(
  '/products/:id',
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
);

app.post(
  '/products',
  asyncHandler(async (req, res) => {
    assert(req.body, CreateProduct);

    const products = await prisma.product.create({
      data: req.body,
    });
    res.send(201).send(products);
  }),
);

app.patch(
  '/products/:id',
  asyncHandler(async (req, res) => {
    assert(req.body, PatchProduct);

    const { id } = req.params;
    const products = await prisma.product.update({
      where: { id },
      data: req.body,
    });
    res.send(products);
  }),
);

app.delete(
  '/products/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const products = await prisma.product.delete({
      where: { id },
    });
    res.sendStatus(204);
  }),
);

app.listen(PORT || 3000, () => console.log('Server started'));
