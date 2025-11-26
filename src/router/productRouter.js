import express from 'express';
import { asyncHandler } from '../handler/handlerFn.js';
import productController from '../controller/productController.js';
import { authenticate } from '../handler/authenticate.js';

const productRouter = express.Router();

productRouter
  .get('/', asyncHandler(productController.getProduct))
  .post('/', authenticate, asyncHandler(productController.createProduct))
  .get('/:id', asyncHandler(productController.getProductById))
  .patch('/:id', authenticate, asyncHandler(productController.updateProduct))
  .delete('/:id', authenticate, asyncHandler(productController.deleteProduct))
  .post('/:id/comments', authenticate, asyncHandler(productController.createComment))
  .get('/:id/comments', asyncHandler(productController.getComment));

export default productRouter;
