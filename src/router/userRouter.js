import express from 'express';
import {
  createUser,
  loginUser,
  logOutUser,
  newRefreshToken,
} from '../controller/userController.js';
import { asyncHandler } from '../lib/asyncHandler.js';
import { verifyRefreshToken } from '../middlewares/auth.js';

const userRouter = express.Router();

userRouter.route('/registration').post(asyncHandler(createUser));
userRouter.route('/login').post(asyncHandler(loginUser));
userRouter
  .route('/token/refresh')
  .post(verifyRefreshToken, asyncHandler(newRefreshToken));
userRouter.route('/logout').post(verifyRefreshToken, asyncHandler(logOutUser));

export default userRouter;
