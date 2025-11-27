import express from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import * as usersController from '../controllers/usersController.js';

const router = express.Router();

router.get('/me', authenticate, usersController.getMyInfo);
router.patch('/me', authenticate, usersController.updateMyInfo);
router.patch('/me/password', authenticate, usersController.updatePassword);
router.get('/me/products', authenticate, usersController.getMyProducts);
export default router;
