import express from 'express';
import asyncHandler from '../lib/asyncHandler.js';
import * as u from '../controllers/mypage-controllers.js';

const mypageRoute = express.Router();

export default mypageRoute;
