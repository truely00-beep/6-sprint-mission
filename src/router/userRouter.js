import express from 'express';
import { createUser, loginUser } from '../controller/userController.js';

const userRouter = express.Router();

userRouter.route('/registration').post(createUser);
userRouter.route('/login').post(loginUser);

export default userRouter;
