import express from 'express';
import { validate } from '../middleware/validate.js';
import { CreateUser } from '../structs/userStruct.js';
import { tryCatchHandler } from '../middleware/errorhandler.js';
import { UploadImage } from '../middleware/formdataParser.js';
import { hashingPassword } from '../middleware/bcrypt.js';
import { AuthController } from '../controller/authController.js';

const authRouter = express.Router();
const profileUpload = UploadImage('user-profiles');

authRouter.post(
  '/register',
  profileUpload.single('profileImage'),
  validate(CreateUser),
  hashingPassword,
  tryCatchHandler(AuthController.register),
);

export default authRouter;
