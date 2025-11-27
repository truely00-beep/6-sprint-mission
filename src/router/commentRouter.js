import express from 'express';
import { asyncHandler } from '../handler/handlerFn.js';

import commentController from '../controller/commentController.js';
import { authenticate } from '../handler/authenticate.js';
import { authorizeSelf } from '../handler/authorize.js';

const commentRouter = express.Router();

commentRouter
  .patch('/:id', authenticate, authorizeSelf, asyncHandler(commentController.updateComment))
  .delete('/:id', authenticate, authorizeSelf, asyncHandler(commentController.deleteComment));

export default commentRouter;
