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

router.post('/', validate(CreateProductSchema, 'body'), createProduct);
router.get('/', validatePagination, getProducts);

router.get('/:id', getProduct);
router.patch('/:id', validate(PatchProductSchema, 'body'), patchProduct);
router.delete('/:id', deleteProduct);

router.use('/:productId/comments', commentsRouter);

export default router;
