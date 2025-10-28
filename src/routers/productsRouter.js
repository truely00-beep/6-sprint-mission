import express from 'express';
import {
  postNewProduct,
  getAllProduct,
  getProductById,
  patchProductById,
  deleteProductById,
} from '../controllers/productsController.js';

const router = express.Router();

router
  .route('/')
  //POST, GET
  .post(postNewProduct)
  .get(getAllProduct);

router
  .route('/:id')
  //GET id, //PATCH id, //DELETE id
  .get(getProductById)
  .patch(patchProductById)
  .delete(deleteProductById);

export default router;
