import express from 'express';
import upload from '../upload.js';
import { uploadSingleImage } from '../controller/imageController.js';
import { asyncHandler } from '../lib/asyncHandler.js';

const imageRouter = express.Router();

imageRouter.post('/', upload.single('image'), asyncHandler(uploadSingleImage));

export default imageRouter;
