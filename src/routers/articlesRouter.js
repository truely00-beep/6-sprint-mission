import express from 'express';
import articleController from '../controllers/articlesController.js';
import {
  validateArticleCreate,
  validateArticleUpdate,
  validateId,
  validatePagination,
} from '../lib/errors/validation.js';
import { asyncHandler } from '../lib/errors/errorHandler.js';

const router = express.Router();

router.post('/', validateArticleCreate, asyncHandler(articleController.createArticle));

router.get('/:id', validateId, asyncHandler(articleController.getArticleById));

router.patch(
  '/:id',
  validateId,
  validateArticleUpdate,
  asyncHandler(articleController.updateArticle),
);

router.delete('/:id', validateId, asyncHandler(articleController.deleteArticle));

router.get('/', validatePagination, asyncHandler(articleController.getArticles));

export default router;
