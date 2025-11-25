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
import { AuthorizationUser, verifyAccessToken } from '../middlewares/auth.js';

const articleRouter = express.Router();

articleRouter
  .route('/')
  .post(
    verifyAccessToken,
    AuthorizationUser,
    validateCreateArticle,
    asyncHandler(createArticle)
  )
  .get(asyncHandler(getArticles));
articleRouter
  .route('/:id')
  .get(validateIdParam, asyncHandler(getArticleById))
  .patch(
    verifyAccessToken,
    AuthorizationUser,
    validateIdParam,
    validateUpdateArticle,
    asyncHandler(updateArticle)
  )
  .delete(
    verifyAccessToken,
    AuthorizationUser,
    validateIdParam,
    asyncHandler(deleteArticle)
  );

export default articleRouter;
