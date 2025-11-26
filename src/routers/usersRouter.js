import express from 'express';
import {
  signup,
  login,
  refresh,
  getMe,
  updateMe,
  changePassword,
  getMyProducts,
} from '../controllers/usersController.js';
import { authMiddleware } from '../lib/authMiddleware.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/refresh', refresh);

router.get('/me', authMiddleware, getMe);
router.patch('/me', authMiddleware, updateMe);
router.patch('/me/password', authMiddleware, changePassword);
router.get('/me/products', authMiddleware, getMyProducts);

export default router;

