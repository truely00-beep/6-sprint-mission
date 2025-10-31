import express from 'express';
import { prisma } from '../utils/prisma.js';
import { validatePagination } from '../middlewares/paginationValidator.js';
import {
  createArticle,
  getArticles,
  getArticle,
  patchArticle,
  deleteArticle,
} from '../controllers/articlesController.js';

const router = express.Router();

router.route('/').post(createArticle).get(validatePagination, getArticles);
router.route('/:id').get(getArticle).patch(patchArticle).delete(deleteArticle);

export default router;
