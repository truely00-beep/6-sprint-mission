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
import { AuthorizationUser, verifyAccessToken } from '../middlewares/auth.js';

const productRouter = express.Router();

productRouter
  .route('/')
  .post(
    verifyAccessToken,
    AuthorizationUser,
    validateCreateProduct,
    asyncHandler(createProduct)
  )
  .get(asyncHandler(getProducts));
productRouter
  .route('/:id')
  .get(validateIdParam, asyncHandler(getProductById))
  .patch(
    verifyAccessToken,
    AuthorizationUser,
    validateIdParam,
    validateUpdateProduct,
    asyncHandler(updateProduct)
  )
  .delete(verifyAccessToken, AuthorizationUser, asyncHandler(deleteProduct));

export default productRouter;
