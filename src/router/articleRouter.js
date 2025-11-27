import express from 'express';
import { asyncHandler } from '../handler/handlerFn.js';
import articleController from '../controller/articleController.js';
import { authenticate } from '../handler/authenticate.js';
import { authorizeSelf } from '../handler/authorize.js';
import likeController from '../controller/likeController.js';

const articleRouter = express.Router();

articleRouter
  .get('/', asyncHandler(articleController.getArticle))
  .post('/', authenticate, asyncHandler(articleController.createArticle))
  .get('/:id', asyncHandler(articleController.getArticleById))
  .patch('/:id', authenticate, authorizeSelf, asyncHandler(articleController.updateArticle))
  .delete('/:id', authenticate, authorizeSelf, asyncHandler(articleController.deleteArticle))
  .post('/:id/comments', authenticate, asyncHandler(articleController.createComment))
  .get('/:id/comments', asyncHandler(articleController.getComment))
  .post('/:id/like', authenticate, asyncHandler(likeController.toggleLike));

export default articleRouter;
