import express from 'express';
import { validate } from '../middleware/validate.js';
import { CreateUser, LoginUser } from '../structs/userStruct.js';
import { tryCatchHandler } from '../middleware/errorhandler.js';
import { UploadImage } from '../middleware/formdataParser.js';
import { hashingPassword } from '../middleware/bcrypt.js';
import { AuthController } from '../controller/authController.js';

const authRouter = express.Router();
const profileUpload = UploadImage('user-profiles');

authRouter;

authRouter
  .post(
    '/register',
    profileUpload.single('profileImage'),
    validate(CreateUser),
    hashingPassword,
    tryCatchHandler(AuthController.register),
  )
  .post('/login', profileUpload.none(), validate(LoginUser), tryCatchHandler(AuthController.login))
  .post('/refresh', profileUpload.none(), tryCatchHandler(AuthController.refreshToken))
  .post('/logout', tryCatchHandler(AuthController.logout));
authRouter;

export default authRouter;
