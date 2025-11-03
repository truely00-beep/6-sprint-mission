import express from 'express';
import { PrismaClient } from '@prisma/client';
import { assert } from 'superstruct';
import { CreateArticle, PatchArticle } from '../structs/articleStructs.js';
import { asyncHandler } from '../handler/handlerFn.js';
import cors from 'cors';

const prisma = new PrismaClient();
const articleRouter = express.Router();

const app = express();
app.use(cors());
app.use(express.json());

articleRouter
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
              { title: { contains: search, mode: 'insensitive' } },
              { content: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {};

      const articles = await prisma.article.findMany({
        where,
        orderBy,
        skip: parseInt(offset),
        take: parseInt(limit),
      });
      res.send(articles);
    }),
  )
  .post(
    asyncHandler(async (req, res) => {
      assert(req.body, CreateArticle);

      const articles = await prisma.article.create({
        data: req.body,
      });
      res.status(201).send(articles);
    }),
  );

articleRouter
  .route('/:id')
  .get(
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      const articles = await prisma.article.findUnique({
        where: { id },
      });
      if (articles) {
        res.send(articles);
      } else {
        res.status(404).send({ message: 'Cannot find given id' });
      }
    }),
  )
  .patch(
    asyncHandler(async (req, res) => {
      assert(req.body, PatchArticle);

      const { id } = req.params;
      const articles = await prisma.article.update({
        where: { id },
        data: req.body,
      });
      res.send(articles);
    }),
  )
  .delete(
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      const articles = await prisma.article.delete({
        where: { id },
      });
      res.sendStatus(204);
    }),
  );

export default articleRouter;
