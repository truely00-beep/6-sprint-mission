import express from 'express';
import asyncHandler from '../lib/asynchandler.js';
import * as c from '../controllers/_comment_controllers.js';
import { commentUpdateValidation } from '../lib/comment_validation.js';

const commentRoute = express.Router();

commentRoute.get('/', asyncHandler(c.commentsList));

commentRoute.get('/:id', asyncHandler(c.commentOnly));
commentRoute.patch(
  '/:id',
  commentUpdateValidation,
  asyncHandler(c.commentUpdate)
);
commentRoute.delete('/:id', asyncHandler(c.commentDelete));

export { commentRoute };
