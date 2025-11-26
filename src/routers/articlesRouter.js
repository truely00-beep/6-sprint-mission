import express from 'express';
import { withAsync } from '../lib/withAsync.js';
import { authMiddleware } from '../lib/authMiddleware.js';
import { optionalAuthMiddleware } from '../lib/optionalAuthMiddleware.js';
import {
  createArticle,
  getArticleList,
  getArticle,
  updateArticle,
  deleteArticle,
  createComment,
  getCommentList,
} from '../controllers/articlesController.js';

const articlesRouter = express.Router();

articlesRouter.post('/', authMiddleware, withAsync(createArticle));
articlesRouter.get('/', optionalAuthMiddleware, withAsync(getArticleList));
articlesRouter.get('/:id', optionalAuthMiddleware, withAsync(getArticle));
articlesRouter.patch('/:id', authMiddleware, withAsync(updateArticle));
articlesRouter.delete('/:id', authMiddleware, withAsync(deleteArticle));
articlesRouter.post('/:id/comments', authMiddleware, withAsync(createComment));
articlesRouter.get('/:id/comments', withAsync(getCommentList));

export default articlesRouter;
