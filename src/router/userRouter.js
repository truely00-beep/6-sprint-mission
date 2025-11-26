import express from 'express';
import { asyncHandler } from '../handler/handlerFn.js';
import UserController from '../controller/userController.js';

const userRouter = express.Router();

userRouter
  .post('/register', asyncHandler(UserController.register))
  .post('/login', asyncHandler(UserController.login))
  .post('/refresh', asyncHandler(UserController.refreshTokens))
  .post('/logout', asyncHandler(UserController.logout));

export default userRouter;
