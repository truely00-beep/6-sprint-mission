import express from 'express';
import { validatePagination } from '../middlewares/paginationValidator.js';
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  patchProduct,
} from '../controllers/productsController.js';

const router = express.Router();

router.route('/').post(createProduct).get(validatePagination, getProducts);
router.route('/:id').get(getProduct).patch(patchProduct).delete(deleteProduct);

export default router;
