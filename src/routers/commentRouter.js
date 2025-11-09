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

const router = express.Router();

router
  .route('/product/:id')
  .get(asyncHandler(getProductComments))
  .post(asyncHandler(createProductComment));

router
  .route('/article/:id')
  .get(asyncHandler(getArticleComments))
  .post(asyncHandler(createArticleComment));

router
  .route('/:id')
  .patch(asyncHandler(updateComment))
  .delete(asyncHandler(deleteComment));

export default router;
