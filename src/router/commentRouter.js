import express from 'express';
import { asyncHandler } from '../handler/handlerFn.js';
import commentController from '../controller/commentController.js';
import { authenticate } from '../handler/authenticate.js';

const commentRouter = express.Router();

commentRouter
  .patch('/:id', authenticate, asyncHandler(commentController.updateComment))
  .delete('/:id', authenticate, asyncHandler(commentController.deleteComment));

export default commentRouter;
