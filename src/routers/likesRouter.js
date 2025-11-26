import express from 'express';
import { authMiddleware } from '../lib/authMiddleware.js';
import { likeProduct, likeArticle, getLikedProducts } from '../controllers/likesController.js';

const router = express.Router();

router.post('/products/:id', authMiddleware, likeProduct);
router.post('/articles/:id', authMiddleware, likeArticle);
router.get('/products', authMiddleware, getLikedProducts);

export default router;

