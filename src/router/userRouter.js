import express from 'express';
import {
  createUser,
  getUserProducts,
  getUserProfile,
  loginUser,
  logOutUser,
  newRefreshToken,
  updateUserProfile,
} from '../controller/userController.js';
import { asyncHandler } from '../lib/asyncHandler.js';
import { authorizeUser, verifyRefreshToken } from '../middlewares/auth.js';

const userRouter = express.Router();

userRouter.post('/registration', asyncHandler(createUser));
userRouter.post('/login', asyncHandler(loginUser));
userRouter.post(
  '/token/refresh',
  verifyRefreshToken,
  asyncHandler(newRefreshToken)
);
userRouter.post('/logout', verifyRefreshToken, asyncHandler(logOutUser));
userRouter.get(
  '/user/profile',
  verifyRefreshToken,
  authorizeUser,
  asyncHandler(getUserProfile)
);
userRouter.patch(
  '/user/update',
  verifyRefreshToken,
  authorizeUser,
  asyncHandler(updateUserProfile)
);
userRouter.get(
  '/user/products',
  verifyRefreshToken,
  authorizeUser,
  asyncHandler(getUserProducts)
);

export default userRouter;
