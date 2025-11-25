import express from 'express';
import { validatePagination } from '../middlewares/paginationValidator.js';
import {
  createArticle,
  getArticles,
  getArticle,
  patchArticle,
  deleteArticle,
} from '../controllers/articlesController.js';
import commentsRouter from './commentsRouter.js';
import { authenticate } from '../middlewares/authenticate.js';
import { validate } from '../middlewares/validate.js';
import { CreateArticleSchema, PatchArticleSchema } from '../validations/articlesSchema.js';

const router = express.Router();

router.post('/', authenticate, validate(CreateArticleSchema, 'body'), createArticle);
router.get('/', validatePagination, getArticles);

router.get('/:id', getArticle);
router.patch('/:id', authenticate, validate(PatchArticleSchema, 'body'), patchArticle);
router.delete('/:id', authenticate, deleteArticle);

router.use('/:articleId/comments', commentsRouter);

export default router;
