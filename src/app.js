import express from 'express';
import { Prisma, PrismaClient } from '@prisma/client';
import { assert } from 'superstruct';
import { PORT } from '../constants.js';
import cors from 'cors';

const prisma = new PrismaClient();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/products', async (req, res) => {
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
});

app.get('/products/:id', async (req, res) => {
  const { id } = req.params;
  const products = await prisma.product.findUnique({
    where: { id },
  });
  res.send(products);
});

app.post('/products', async (req, res) => {
  const products = await prisma.product.create({
    data: req.body,
  });
  res.sendStatus(201).send(products);
});

app.patch('/products/:id', async (req, res) => {
  const { id } = req.params;
  const products = await prisma.product.update({
    where: { id },
    data: req.body,
  });
  res.send(products);
});

app.delete('/products/:id', async (req, res) => {
  const { id } = req.params;
  const products = await prisma.product.delete({
    where: { id },
  });
  res.sendStatus(204);
});

app.listen(PORT || 3000, () => console.log('Server started'));
