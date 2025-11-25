import express from 'express';
import asyncHandler from '../lib/asynchandler.js';
import * as a from '../controllers/auth-controllers.js';

const authRoute = express.Router();

export default authRoute;
