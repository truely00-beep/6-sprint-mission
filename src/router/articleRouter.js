import express from 'express';
import {
  validateCreateArticle,
  validateGetListArticle,
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
import { authorizeUser, verifyAccessToken } from '../middlewares/auth.js';

const articleRouter = express.Router();

articleRouter
  .route('/')
  .post(
    verifyAccessToken,
    authorizeUser,
    validateCreateArticle,
    asyncHandler(createArticle)
  )
  .get(validateGetListArticle, asyncHandler(getArticles));
articleRouter
  .route('/:id')
  .get(validateIdParam, asyncHandler(getArticleById))
  .patch(
    verifyAccessToken,
    authorizeUser,
    validateIdParam,
    validateUpdateArticle,
    asyncHandler(updateArticle)
  )
  .delete(
    verifyAccessToken,
    authorizeUser,
    validateIdParam,
    asyncHandler(deleteArticle)
  );

export default articleRouter;
