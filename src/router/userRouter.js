import express from 'express';
import {
  createUser,
  getUserProducts,
  getUserProfile,
  likeArticleButton,
  likeArticleList,
  likeProductButton,
  likeProductList,
  loginUser,
  logOutUser,
  newRefreshToken,
  updateUserProfile,
} from '../controller/userController.js';
import { asyncHandler } from '../lib/asyncHandler.js';
import { authorizeUser, verifyRefreshToken } from '../middlewares/auth.js';
import {
  validateCreateUser,
  validateLoginUser,
  validateUpdateUser,
} from '../middlewares/validate/validateUser.js';
import {
  validateArticleIdParam,
  validateProductIdParam,
} from '../middlewares/validate/validateId.js';

const userRouter = express.Router();

userRouter.post('/registration', validateCreateUser, asyncHandler(createUser));
userRouter.post('/login', validateLoginUser, asyncHandler(loginUser));
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
  validateUpdateUser,
  asyncHandler(updateUserProfile)
);
userRouter.get(
  '/user/products',
  verifyRefreshToken,
  authorizeUser,
  asyncHandler(getUserProducts)
);
userRouter.post(
  '/products/:productId/',
  verifyRefreshToken,
  authorizeUser,
  validateProductIdParam,
  asyncHandler(likeProductButton)
);
userRouter.post(
  '/articles/:articleId/',
  verifyRefreshToken,
  authorizeUser,
  validateArticleIdParam,
  asyncHandler(likeArticleButton)
);
userRouter.get(
  '/products/like',
  verifyRefreshToken,
  authorizeUser,
  asyncHandler(likeProductList)
);
userRouter.get(
  '/articles/like',
  verifyRefreshToken,
  authorizeUser,
  asyncHandler(likeArticleList)
);
export default userRouter;
