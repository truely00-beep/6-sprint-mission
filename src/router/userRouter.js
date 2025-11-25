import express from 'express';
import { createUser } from '../controller/userController.js';

const userRouter = express.Router();

userRouter.route('/registration').post(createUser);

export default userRouter;
