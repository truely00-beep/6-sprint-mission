import express from 'express';
import { PrismaClient } from '@prisma/client';
import {
  validateComment,
  validateUpdateComment,
} from '../middlewares/validate/validateComment.js';

const router = express.Router();
const prisma = new PrismaClient();

router.post('/product/:productId', validateComment, async (req, res) => {
  const { productId } = req.params;
  const { content } = req.body;
  const data = await prisma.comment.create({
    data: { content, productId },
  });
  res.status(201).json(data);
});

router.post('/article/:articleId', validateComment, async (req, res) => {
  const { articleId } = req.params;
  const { content } = req.body;
  const data = await prisma.comment.create({
    data: { articleId, content },
  });
  res.status(201).json(data);
});

router.patch('/:id', validateUpdateComment, async (req, res) => {
  const { id } = req.params;
  const data = await prisma.comment.update({
    where: { id },
    data: req.body,
  });
  res.status(200).json(data);
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const data = await prisma.comment.delete({
    where: { id },
  });
  res.status(204).json(data);
});

router.get('/product/:productId', async (req, res) => {
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
  res.status(200).json(data);
});

router.get('/article/:articleId', async (req, res) => {
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
  res.status(200).json(data);
});

export default router;
