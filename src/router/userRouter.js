import express from 'express';
import { asyncHandler } from '../handler/handlerFn.js';
import UserController from '../controller/userController.js';
import { authenticate } from '../handler/authenticate.js';

const userRouter = express.Router();

userRouter
  .get('/me', authenticate, asyncHandler(UserController.getMe))
  .patch('/me', authenticate, asyncHandler(UserController.updateMe))
  .patch('/me/password', authenticate, asyncHandler(UserController.updateMyPassword))
  .get('/me/products', authenticate, asyncHandler(UserController.getMyProduct))
  .get('/me/likes', authenticate, asyncHandler(UserController.getLikedProducts));

export default userRouter;
