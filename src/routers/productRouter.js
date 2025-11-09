import express from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { validateProduct } from '../middleware/validation.js';

const router = express.Router();

router
  .route('/')
  .get(asyncHandler(getProducts))
  .post(validateProduct, asyncHandler(createProduct));

router
  .route('/:id')
  .get(asyncHandler(getProductById))
  .patch(asyncHandler(updateProduct))
  .delete(asyncHandler(deleteProduct));

export default router;
