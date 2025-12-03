import express from 'express';
import { asyncHandler } from '../handler/handlerFn.js';
import authController from '../controller/authController.js';

const authRouter = express.Router();

authRouter
  .post('/register', asyncHandler(authController.register))
  .post('/login', asyncHandler(authController.login))
  .post('/refresh', asyncHandler(authController.refreshTokens))
  .post('/logout', asyncHandler(authController.logout));

export default authRouter;
