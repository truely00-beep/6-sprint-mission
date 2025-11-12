import express from 'express';
import { PrismaClient } from '@prisma/client';
import { assert } from 'superstruct';
import { CreateProductComment, PatchProductComment } from '../structs/commentStructs.js';
import { asyncHandler } from '../handler/handlerFn.js';
import cors from 'cors';

const prisma = new PrismaClient();
const productCommentRouter = express.Router();

const app = express();
app.use(cors());
app.use(express.json());

productCommentRouter
  .route('/')
  .post(
    asyncHandler(async (req, res) => {
      assert(req.body, CreateProductComment);

      const { productId, content } = req.body;
      const comments = await prisma.commentToProduct.create({
        data: {
          content,
          product: {
            connect: { id: productId },
          },
        },
        include: {
          product: true,
        },
      });
      res.status(201).send(comments);
    }),
  )
  .get(
    asyncHandler(async (req, res) => {
      const { productId, cursor, limit = 10 } = req.query;

      const comments = await prisma.commentToProduct.findMany({
        where: { productId },
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

      //const nextCursor = comments.length > 0 ? comments[comments.length - 1].id : null;

      res.send({
        data: comments,
        //nextCursor,
      });
    }),
  );

productCommentRouter
  .route('/:id')
  .patch(
    asyncHandler(async (req, res) => {
      assert(req.body, PatchProductComment);

      const { id } = req.params;
      const comments = await prisma.commentToProduct.update({
        where: { id },
        data: { content: req.body.content },
      });
      res.send(comments);
    }),
  )
  .delete(
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      const comments = await prisma.commentToProduct.delete({
        where: { id },
      });
      res.sendStatus(204);
    }),
  );

export default productCommentRouter;
