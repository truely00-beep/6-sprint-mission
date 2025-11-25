import express from 'express';
import { validate } from '../middleware/validate.js';
import { CreateUser, PatchUser } from '../structs/userStruct.js';
import { UserController } from '../controller/userController.js';
import { tryCatchHandler } from '../middleware/errorhandler.js';

const userRouter = express.Router();

userRouter
  .route('/')
  .get(tryCatchHandler(UserController.getUsers))
  .post(validate(CreateUser), tryCatchHandler(UserController.createUser));

userRouter
  .route('/:id')
  .get(tryCatchHandler(UserController.getUserDetail))
  .patch(validate(PatchUser), tryCatchHandler(UserController))
  .delete(tryCatchHandler(UserController.deleteUser));

export default userRouter;
