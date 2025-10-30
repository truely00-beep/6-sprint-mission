import express from 'express';
import { CreateArticle, PatchArticle } from '../structs/articleStructs.js';
import { assert } from 'superstruct';
import { Prisma, PrismaClient } from '@prisma/client';
import { asyncHandler } from '../lib/asyncHandler.js';

const app = express();
const prisma = new PrismaClient();

app.get('/articles', async (req, res) => {});

app.post('/articles', async (req, res) => {
  const data = req.body;
  assert(data, CreateArticle);
  const article = await prisma.article.create({
    data,
  });
  res.status(201).send(article);
});

app.get(
  '/articles/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const article = await prisma.article.findUniqueOrThrow({
      where: { id },
    });
    res.send(article);
  }),
);

app.patch(
  '/articles/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    assert(data, PatchArticle);
    const article = await prisma.article.update({
      where: { id },
      data,
    });
    res.send(article);
  }),
);

app.delete(
  '/articles/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const article = await prisma.article.delete({
      where: { id },
    });
    res.json({ message: '삭제에 성공했습니다.', data: article });
  }),
);
