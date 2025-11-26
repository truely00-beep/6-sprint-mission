import express from 'express';
import { withAsync } from '../lib/withAsync.js';
import { authMiddleware } from '../lib/authMiddleware.js';
import { optionalAuthMiddleware } from '../lib/optionalAuthMiddleware.js';
import {
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  getProductList,
  createComment,
  getCommentList,
} from '../controllers/productsController.js';

const productsRouter = express.Router();

productsRouter.post('/', authMiddleware, withAsync(createProduct));
productsRouter.get('/:id', optionalAuthMiddleware, withAsync(getProduct));
productsRouter.patch('/:id', authMiddleware, withAsync(updateProduct));
productsRouter.delete('/:id', authMiddleware, withAsync(deleteProduct));
productsRouter.get('/', optionalAuthMiddleware, withAsync(getProductList));
productsRouter.post('/:id/comments', authMiddleware, withAsync(createComment));
productsRouter.get('/:id/comments', withAsync(getCommentList));

export default productsRouter;
