import express from 'express';
import { asyncHandler } from '../handler/handlerFn.js';
import UserController from '../controller/userController.js';
import { authenticate } from '../handler/authenticate.js';
import { authorizeSelf } from '../handler/authorize.js';

const userRouter = express.Router();

userRouter
  .post('/register', asyncHandler(UserController.register))
  .post('/login', asyncHandler(UserController.login))
  .post('/refresh', asyncHandler(UserController.refreshTokens))
  .post('/logout', asyncHandler(UserController.logout))
  .get('/:nickname', authenticate, authorizeSelf, asyncHandler(UserController.getUser))
  .patch('/:nickname', authenticate, authorizeSelf, asyncHandler(UserController.updateUser))
  .patch(
    '/:nickname/password',
    authenticate,
    authorizeSelf,
    asyncHandler(UserController.updateUserPassword),
  )
  .get(
    '/:nickname/products',
    authenticate,
    authorizeSelf,
    asyncHandler(UserController.getUserProduct),
  );

export default userRouter;
