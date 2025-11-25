import express from 'express';
import asyncHandler from '../lib/asynchandler.js';
import * as u from '../controllers/mypage-controllers.js';

const mypageRoute = express.Router();

export default mypageRoute;
