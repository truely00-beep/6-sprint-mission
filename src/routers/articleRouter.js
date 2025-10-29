import express from 'express';
import {
  createArticle,
  getListArticles,
  getArticleById,
  patchArticleById,
  deleteArticleById,
} from '../controllers/articleController.js';

const router = express.Router();

router
  .route('/')
  //POST  //GET
  .get(getListArticles)
  .post(createArticle);

router
  .route('/:id')
  //GET id //PATCH id //DELETE id
  .get(getArticleById)
  .patch(patchArticleById)
  .delete(deleteArticleById);
