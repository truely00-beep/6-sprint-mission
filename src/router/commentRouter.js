import express from 'express';
import { asyncHandler } from '../handler/handlerFn.js';

import commentController from '../controller/commentController.js';

const commentRouter = express.Router();

commentRouter
  .patch('/:id', asyncHandler(commentController.updateComment))
  .delete('/:id', asyncHandler(commentController.deleteComment));

export default commentRouter;
