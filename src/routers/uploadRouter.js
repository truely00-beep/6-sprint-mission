import express from 'express';
import { upload } from '../middleware/uploads.js';
import { uploadFileController } from '../controllers/uploadController.js';

const router = express.Router();

router.post('/', upload.single('image'), uploadFileController);

export default router;
