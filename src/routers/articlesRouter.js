import express from 'express';
import { validatePagination } from '../middlewares/paginationValidator.js';
import {
  createArticle,
  getArticles,
  getArticle,
  patchArticle,
  deleteArticle,
} from '../controllers/articlesController.js';
import commentsRouter from './commentsRouter.js';

import { validate } from '../middlewares/validate.js';
import { CreateArticleSchema, PatchArticleSchema } from '../validations/articlesSchema.js';

const router = express.Router();

router
  .route('/')
  .post(validate(CreateArticleSchema, 'body'), createArticle)
  .get(validatePagination, getArticles);

router
  .route('/:id')
  .get(getArticle)
  .patch(validate(PatchArticleSchema, 'body'), patchArticle)
  .delete(deleteArticle);

router.use('/:articleId/comments', commentsRouter);

export default router;
