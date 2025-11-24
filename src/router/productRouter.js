import express from 'express';
import { asyncHandler } from '../handler/handlerFn.js';
import productController from '../controller/productController.js';

const productRouter = express.Router();

productRouter
  .get('/', asyncHandler(productController.getProduct))
  .post('/', asyncHandler(productController.createProduct))
  .get('/:id', asyncHandler(productController.getProductById))
  .patch('/:id', asyncHandler(productController.updateProduct))
  .delete('/:id', asyncHandler(productController.deleteProduct))
  .post('/:id/comments', asyncHandler(productController.createComment))
  .get('/:id/comments', asyncHandler(productController.getComment));

export default productRouter;
