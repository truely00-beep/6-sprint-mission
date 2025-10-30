import express from 'express';
import { CreateProduct, PatchProduct } from './structs/productStructs.js';
import { assert } from 'superstruct';
import { Prisma, PrismaClient } from '@prisma/client';
import cors from 'cors';
import { CreateArticle, PatchArticle } from './structs/articleStructs.js';
import { asyncHandler } from './lib/asyncHandler.js';

const PORT = 3000;
const app = express();

//컨트롤러로 이동 예정
app.use(express.json());
app.use(cors());

const prisma = new PrismaClient();

// app.get('/products', (req, res) => {
//   res.send('Hello Express');
// });

app.post('/products', async (req, res) => {
  const data = req.body;
  assert(data, CreateProduct);
  const product = await prisma.product.create({
    data,
  });
  res.status(201).send(product);
});

app.post('/articles', async (req, res) => {
  const data = req.body;
  assert(data, CreateArticle);
  const article = await prisma.article.create({
    data,
  });
  res.status(201).send(article);
});

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

//------------------------------------------------

app.listen(PORT, () => {
  console.log('Server Started');
});
//--------------------------------------------------------
