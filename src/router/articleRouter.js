import express from 'express';
import {
  validateCreateArticle,
  validateUpdateArticle,
} from '../middlewares/validate/validateArticle.js';
import { asyncHandler } from '../lib/asyncHandler.js';
import { validateIdParam } from '../middlewares/validate/validateId.js';
import {
  createArticle,
  deleteArticle,
  getArticleById,
  getArticles,
  updateArticle,
} from '../controller/articleController.js';

const articleRouter = express.Router();

articleRouter
  .route('/')
  .post(validateCreateArticle, asyncHandler(createArticle))
  .get(asyncHandler(getArticles));
articleRouter
  .route('/:id')
  .get(validateIdParam, asyncHandler(getArticleById))
  .patch(validateIdParam, validateUpdateArticle, asyncHandler(updateArticle))
  .delete(validateIdParam, asyncHandler(deleteArticle));

export default articleRouter;
