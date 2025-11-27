import express from 'express';
import { asyncHandler } from '../handler/handlerFn.js';
import productController from '../controller/productController.js';
import { authenticate } from '../handler/authenticate.js';
import { authorizeSelf } from '../handler/authorize.js';
import likeController from '../controller/likeController.js';
import UserController from '../controller/userController.js';

const productRouter = express.Router();

productRouter
  .get('/', authenticate, asyncHandler(productController.getProduct))
  .post('/', authenticate, asyncHandler(productController.createProduct))
  .get('/:id', authenticate, asyncHandler(productController.getProductById))
  .patch('/:id', authenticate, authorizeSelf, asyncHandler(productController.updateProduct))
  .delete('/:id', authenticate, authorizeSelf, asyncHandler(productController.deleteProduct))
  .post('/:id/comments', authenticate, asyncHandler(productController.createComment))
  .get('/:id/comments', authenticate, asyncHandler(productController.getComment))
  .post('/:id/like', authenticate, asyncHandler(likeController.toggleLike))
  .get(
    '/:nickname/likes',
    authenticate,
    authorizeSelf,
    asyncHandler(UserController.getLikedProducts),
  );

export default productRouter;
