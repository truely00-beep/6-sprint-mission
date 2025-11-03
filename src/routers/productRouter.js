import express from 'express';
import {
  createProduct,
  getListProducts,
  getProductById,
  patchProductById,
  deleteProductById,
} from '../controllers/productController.js';
import {
  createCommentForProduct,
  getCommentListProduct,
} from '../controllers/commentController.js';

const router = express.Router();

router
  .route('/')
  //POST, GET
  .post(createProduct)
  .get(getListProducts);

router
  .route('/:id')
  //GET id, //PATCH id, //DELETE id
  .get(getProductById)
  .patch(patchProductById)
  .delete(deleteProductById);

//중고 장터
router
  .route('/:productId/comments')
  //POST  //GET
  .post(createCommentForProduct) //중고장터 댓글
  .get(getCommentListProduct); //중고장터

export default router;
