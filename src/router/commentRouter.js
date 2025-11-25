import express from 'express';
import {
  validateComment,
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

const commentRouter = express.Router();

commentRouter
  .route('/product/:productId')
  .post(
    validateProductIdParam,
    validateComment,
    asyncHandler(createProductComment)
  )
  .get(validateProductIdParam, asyncHandler(getCommentsByProductId));

commentRouter
  .route('/article/:articleId')
  .post(
    validateArticleIdParam,
    validateComment,
    asyncHandler(createArticleComment)
  )
  .get(validateArticleIdParam, asyncHandler(getCommentsByArticleId));

commentRouter
  .route('/:id')
  .patch(validateIdParam, validateUpdateComment, asyncHandler(updateComment))
  .delete(validateIdParam, asyncHandler(deleteComment));

export default commentRouter;
