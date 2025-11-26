import express from 'express';
import asyncHandler from '../lib/asyncHandler.js';
import * as a from '../controllers/auth-controllers.js';
import { userCreateValidation } from '../validators/user-validation.js';

const authRoute = express.Router();

authRoute.post('/register', userCreateValidation, asyncHandler(a.register));
authRoute.post('/login', asyncHandler(a.login));
authRoute.post('/logout', asyncHandler(a.logout));

export default authRoute;
