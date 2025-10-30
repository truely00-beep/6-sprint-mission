import express from 'express';
import { PrismaClient } from '@prisma/client';
import { assert } from 'superstruct';
import { CreateArticleComment, PatchArticleComment } from '../structs/commentStructs.js';
import { asyncHandler } from '../handlerFn.js';
import cors from 'cors';

const prisma = new PrismaClient();
const articleCommentRouter = express.Router();

const app = express();
app.use(cors());
app.use(express.json());

articleCommentRouter
  .route('/')
  .post(
    asyncHandler(async (req, res) => {
      assert(req.body, CreateArticleComment);

      const { articleId, content } = req.body;
      const comments = await prisma.commentToArticle.create({
        data: {
          content,
          article: {
            connect: { id: articleId },
          },
        },
        include: {
          article: true,
        },
      });
      res.status(201).send(comments);
    }),
  )
  .get(
    asyncHandler(async (req, res) => {
      const { articleId, cursor, limit = 10 } = req.query;

      const comments = await prisma.commentToArticle.findMany({
        where: { articleId },
        select: {
          id: true,
          content: true,
          createdAt: true,
        },
        take: parseInt(limit),
        ...(cursor
          ? {
              skip: 1,
              cursor: { id: cursor },
            }
          : {}),
        orderBy: {
          createdAt: 'desc',
        },
      });
      res.send({
        data: comments,
      });
    }),
  );

articleCommentRouter
  .route('/:id')
  .patch(
    asyncHandler(async (req, res) => {
      assert(req.body, PatchArticleComment);

      const { id } = req.params;
      const comments = await prisma.commentToArticle.update({
        where: { id },
        data: { content: req.body.content },
      });
      res.send(comments);
    }),
  )
  .delete(
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      const comments = await prisma.commentToArticle.delete({
        where: { id },
      });
      res.sendStatus(204);
    }),
  );

export default articleCommentRouter;
