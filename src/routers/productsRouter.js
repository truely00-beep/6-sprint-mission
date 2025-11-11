import express from 'express';
import { validatePagination } from '../middlewares/paginationValidator.js';
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  patchProduct,
} from '../controllers/productsController.js';
import commentsRouter from './commentsRouter.js';

import { validate } from '../middlewares/validate.js';
import { CreateProductSchema, PatchProductSchema } from '../validations/productsSchema.js';

const router = express.Router();

router
  .route('/')
  .post(validate(CreateProductSchema, 'body'), createProduct)
  .get(validatePagination, getProducts);

router
  .route('/:id')
  .get(getProduct)
  .patch(validate(PatchProductSchema, 'body'), patchProduct)
  .delete(deleteProduct);

router.use('/:productId/comments', commentsRouter);

export default router;
