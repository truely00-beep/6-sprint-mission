import express from 'express';
import asyncHandler from '../lib/asyncHandler.js';
import * as p from '../controllers/product-controllers.js';
import * as pc from '../controllers/productComment-controllers.js';

import {
  productCreateValidation,
  productUpdateValidation,
} from '../validators/product-validation.js';

import {
  commentCreateValidation,
  commentUpdateValidation,
} from '../validators/comment-validation.js';

import authenticate from '../middleware/authenticate.js';

const productRoute = express.Router();

productRoute.post(
  '/',
  authenticate,
  productCreateValidation,
  asyncHandler(p.createProduct)
);
productRoute.get('/', asyncHandler(p.getProductsList));

productRoute.get('/:id', asyncHandler(p.getProductInfo));

productRoute.patch(
  '/:id',
  authenticate,
  productUpdateValidation,
  asyncHandler(p.updateProduct)
);

productRoute.delete('/:id', authenticate, asyncHandler(p.deleteProduct));

// ======= product에 연결 된 comment =======
// Product와 comment가 별도의 모델로 구동되므로
// 별도의 작업으로 제작 하였습니다

productRoute.post(
  '/:productId/comments',
  authenticate,
  commentCreateValidation,
  asyncHandler(pc.createProductComment)
);

productRoute.get(
  '/:productId/comments',
  asyncHandler(pc.getProductCommentList)
);

productRoute.patch(
  '/:productId/comments/:commentId',
  authenticate,
  commentUpdateValidation,
  asyncHandler(pc.updateProductComment)
);

productRoute.delete(
  '/:productId/comments/:commentId',
  authenticate,
  asyncHandler(pc.deleteProductComment)
);

export default productRoute;
