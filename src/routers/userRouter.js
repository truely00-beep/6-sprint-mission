import express from 'express';
import { validate } from '../middleware/validate.js';
import { PatchUser } from '../structs/userStruct.js';
import { UserController } from '../controller/userController.js';
import { tryCatchHandler } from '../middleware/errorhandler.js';

const userRouter = express.Router();

userRouter.route('/').get(tryCatchHandler(UserController.getUsers));

userRouter
  .route('/:userId')
  .get(tryCatchHandler(UserController.getUserDetail))
  .patch(validate(PatchUser), tryCatchHandler(UserController.patchUser))
  .delete(tryCatchHandler(UserController.deleteUser));

export default userRouter;
