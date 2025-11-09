import express from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';
import {
  getArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
} from '../controllers/articleController.js';
import { validateArticle } from '../middleware/validation.js';

const router = express.Router();

router
  .route('/')
  .get(asyncHandler(getArticles))
  .post(validateArticle, asyncHandler(createArticle));

router
  .route('/:id')
  .get(asyncHandler(getArticleById))
  .patch(asyncHandler(updateArticle))
  .delete(asyncHandler(deleteArticle));

export default router;
