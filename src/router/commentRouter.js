import express from 'express';
import {
  validateCreateComment,
  validateUpdateComment,
} from '../middlewares/validate/validateComment.js';
import { asyncHandler } from '../lib/asyncHandler.js';
import {
  validateProductIdParam,
  validateArticleIdParam,
  validateIdParam,
} from '../middlewares/validate/validateId.js';
import {
  createArticleComment,
  createProductComment,
  deleteComment,
  getCommentsByArticleId,
  getCommentsByProductId,
  updateComment,
} from '../controller/commentController.js';
import { authorizeUser, verifyAccessToken } from '../middlewares/auth.js';

const commentRouter = express.Router();

commentRouter
  .route('/product/:productId')
  .post(
    verifyAccessToken,
    authorizeUser,
    validateProductIdParam,
    validateCreateComment,
    asyncHandler(createProductComment)
  )
  .get(validateProductIdParam, asyncHandler(getCommentsByProductId));

commentRouter
  .route('/article/:articleId')
  .post(
    verifyAccessToken,
    authorizeUser,
    validateArticleIdParam,
    validateCreateComment,
    asyncHandler(createArticleComment)
  )
  .get(validateArticleIdParam, asyncHandler(getCommentsByArticleId));

commentRouter
  .route('/:id')
  .patch(
    verifyAccessToken,
    authorizeUser,
    validateIdParam,
    validateUpdateComment,
    asyncHandler(updateComment)
  )
  .delete(
    verifyAccessToken,
    authorizeUser,
    validateIdParam,
    asyncHandler(deleteComment)
  );

export default commentRouter;
