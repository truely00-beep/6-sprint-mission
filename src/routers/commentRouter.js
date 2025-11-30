import express from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';
import {
  createProductComment,
  createArticleComment,
  getProductComments,
  getArticleComments,
  updateComment,
  deleteComment,
} from '../controllers/commentController.js';
import authenticate from '../middleware/authenticate.js';
import { validateComment } from '../middleware/validation.js';

const router = express.Router();

router
  .route('/product/:id')
  .get(asyncHandler(getProductComments))
  .post(authenticate, validateComment, asyncHandler(createProductComment));

router
  .route('/article/:id')
  .get(asyncHandler(getArticleComments))
  .post(authenticate, validateComment, asyncHandler(createArticleComment));

router
  .route('/:id')
  .patch(authenticate, validateComment, asyncHandler(updateComment))
  .delete(authenticate, asyncHandler(deleteComment));

export default router;
