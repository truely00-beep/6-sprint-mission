import express from 'express';
import { asyncHandler } from '../handler/handlerFn.js';
import articleController from '../controller/articleController.js';

const articleRouter = express.Router();

articleRouter
  .get('/', asyncHandler(articleController.getArticle))
  .post('/', asyncHandler(articleController.createArticle))
  .get('/:id', asyncHandler(articleController.getArticleById))
  .patch('/:id', asyncHandler(articleController.updateArticle))
  .delete('/:id', asyncHandler(articleController.deleteArticle))
  .post('/:id/comments', asyncHandler(articleController.createComment))
  .get('/:id/comments', asyncHandler(articleController.getComment));

export default articleRouter;
