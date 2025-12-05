import express, { Router } from 'express';
import { tryCatchHandler } from '../middleware/errorhandler.js';
import { authenticate } from '../middleware/authenticate.js';
import { textParser } from '../middleware/formdataParser.js';
import { Like } from '../controller/likeController.js';
export const likeRouter = express.Router();

likeRouter.post('/productLike/:productId', authenticate, tryCatchHandler(Like.toggleProductLike));

likeRouter.post('/articleLike/:articleId', authenticate, tryCatchHandler(Like.toggleArticleLike));

export default likeRouter;
