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

export default router;
