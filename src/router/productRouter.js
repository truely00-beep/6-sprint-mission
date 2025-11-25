import express from 'express';
import {
  validateCreateProduct,
  validateUpdateProduct,
} from '../middlewares/validate/validateProduct.js';
import { asyncHandler } from '../lib/asyncHandler.js';
import { validateIdParam } from '../middlewares/validate/validateId.js';
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from '../controller/productController.js';

const productRouter = express.Router();

productRouter
  .route('/')
  .post(validateCreateProduct, asyncHandler(createProduct))
  .get(asyncHandler(getProducts));
productRouter
  .route('/:id')
  .get(validateIdParam, asyncHandler(getProductById))
  .patch(validateIdParam, validateUpdateProduct, asyncHandler(updateProduct))
  .delete(asyncHandler(deleteProduct));

export default productRouter;
