import express from 'express';
import { CreateProduct, PatchProduct } from '../structs/productStructs.js';
import { Prisma, PrismaClient } from '@prisma/client';
import { assert } from 'superstruct';
import { asyncHandler } from '../lib/asyncHandler.js';

const app = express();
const prisma = new PrismaClient();

app.post(
  '/products',
  asyncHandler(async (req, res) => {
    const data = req.body;
    assert(data, CreateProduct);
    const product = await prisma.product.create({
      data,
    });
    res.status(201).send(product);
  }),
);

app.get(
  '/products/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const product = await prisma.product.findUniqueOrThrow({
      where: { id },
    });
    res.send(product);
  }),
);

app.patch(
  '/products/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    assert(data, PatchProduct);
    const product = await prisma.product.update({
      where: { id },
      data,
    });
    res.send(product);
  }),
);

app.delete(
  '/products/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const product = await prisma.product.delete({
      where: { id },
    });
    res.json({ message: '삭제에 성공했습니다.', data: product });
  }),
);

app.get(
  '/products',
  asyncHandler(async (req, res) => {
    const { offset = 0, limit = 10, order = 'newest', includeWord = '' } = req.query;
    let orderBy;
    switch (order) {
      case 'oldest':
        orderBy = { createdAt: 'asc' };
        break;
      case 'newest':
      default:
        orderBy = { createdAt: 'desc' };
    }
    const findWord = String(includeWord || '').trim();
    const where = findWord
      ? {
          OR: [
            { name: { contains: findWord, mode: 'insensitive' } },
            { description: { contains: findWord, mode: 'insensitive' } },
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
