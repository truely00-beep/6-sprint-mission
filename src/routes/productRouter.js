import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

router.post('/', async (req, res) => {
  const data = await prisma.product.create({
    data: req.body,
  });
  res.status(201).json(data);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const data = await prisma.product.findUnique({
    where: { id },
  });
  res.status(200).json(data);
});

router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const data = await prisma.product.update({
    where: { id },
    data: req.body,
  });
  res.status(200).json(data);
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const data = await prisma.product.delete({
    where: { id },
  });
  res.status(204).json(data);
});

router.get('/', async (req, res) => {
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
});

export default router;
