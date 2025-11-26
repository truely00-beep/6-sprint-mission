import express from 'express';
import {
  validateCreateProduct,
  validateGetListProduct,
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
import { authorizeUser, verifyAccessToken } from '../middlewares/auth.js';

const productRouter = express.Router();

productRouter
  .route('/')
  .post(
    verifyAccessToken,
    authorizeUser,
    validateCreateProduct,
    asyncHandler(createProduct)
  )
  .get(validateGetListProduct, asyncHandler(getProducts));
productRouter
  .route('/:id')
  .get(validateIdParam, asyncHandler(getProductById))
  .patch(
    verifyAccessToken,
    authorizeUser,
    validateIdParam,
    validateUpdateProduct,
    asyncHandler(updateProduct)
  )
  .delete(verifyAccessToken, authorizeUser, asyncHandler(deleteProduct));

export default productRouter;
