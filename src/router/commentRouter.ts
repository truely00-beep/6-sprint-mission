import express from 'express';
import { asyncHandler } from '../handler/handlerFn';
import commentController from '../controller/commentController';
import { authenticate } from '../handler/authenticate';

const commentRouter = express.Router();

commentRouter
  .patch('/:id', authenticate, asyncHandler(commentController.updateComment))
  .delete('/:id', authenticate, asyncHandler(commentController.deleteComment));

export default commentRouter;
