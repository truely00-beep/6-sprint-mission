import express from 'express';
import asyncHandler from '../lib/asynchandler.js';
import * as p from '../controllers/product_controllers.js';
import * as pc from '../controllers/productComment_controllers.js';

import {
  productCreateValidation,
  productUpdateValidation,
} from '../lib/product_validation.js';

import {
  commentCreateValidation,
  commentUpdateValidation,
} from '../lib/comment_validation.js';

const productRoute = express.Router();

productRoute.get('/', asyncHandler(p.productsList));
productRoute.post('/', productCreateValidation, asyncHandler(p.productNew));

productRoute.get('/:id', asyncHandler(p.productOnly));
productRoute.patch(
  '/:id',
  productUpdateValidation,
  asyncHandler(p.productUpdate)
);
productRoute.delete('/:id', asyncHandler(p.productDelete));

// ======= product에 연결 된 comment =======
// Product와 comment가 별도의 모델로 구동되므로
// 별도의 작업으로 제작 하였습니다

productRoute.get(
  '/:productId/productcomments',
  asyncHandler(pc.productCommentList)
);
productRoute.post(
  '/:productId/productcomments',
  commentCreateValidation,
  asyncHandler(pc.productCommentNew)
);

productRoute.patch(
  '/:productId/productcomments/:commentId',
  commentUpdateValidation,
  asyncHandler(pc.productCommentUpdate)
);
productRoute.delete(
  '/:productId/productcomments/:commentId',
  asyncHandler(pc.productCommentDelete)
);

export { productRoute };
