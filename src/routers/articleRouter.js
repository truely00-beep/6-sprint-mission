import express from 'express';
import { validate } from '../middleware/validate.js';
import { CreateArticle, PatchArticle } from '../structs/articleStruct.js';
import { tryCatchHandler } from '../middleware/errorhandler.js';
import { ArticleController } from '../controller/articleController.js';
import { UploadImage } from '../middleware/formdataParser.js';
import { authenticate } from '../middleware/authenticate.js';

const articleRouter = express.Router();

const articleImageUpload = UploadImage('article-image');

// 자유게시판 목록 조회 및 생성
articleRouter
  .route('/')
  .get(tryCatchHandler(ArticleController.getArticles))
  .post(
    authenticate,
    articleImageUpload.array('articleImage', 5),
    validate(CreateArticle),
    tryCatchHandler(ArticleController.createArticle),
  );
// 자유게시판 상세 조회 및 수정 및 삭제
articleRouter
  .route('/:articleId')
  .get(tryCatchHandler(ArticleController.getArticleDetail))
  .patch(
    authenticate,
    articleImageUpload.none(),
    validate(PatchArticle),
    tryCatchHandler(ArticleController.patchArticle),
  )
  .delete(authenticate, tryCatchHandler(ArticleController.deleteArticle));

export default articleRouter;
