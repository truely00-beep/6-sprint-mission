import express from 'express';
import {
  postNewArticle,
  getAllArticles,
  getArticleById,
  patchArticleById,
  deleteArticleById,
} from '../controllers/articlesController.js';

const router = express.Router();

router
  .route('/')
  //POST  //GET
  .get(getAllArticles)
  .post(postNewArticle);

router
  .route('/:id')
  //GET id //PATCH id //DELETE id
  .get(getArticleById)
  .patch(patchArticleById)
  .delete(deleteArticleById);
