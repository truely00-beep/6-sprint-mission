import express from 'express';
import { validate } from '../middleware/validate.js';
import { CreateArticle, PatchArticle } from '../structs/articleStruct.js';
import { tryCatchHandler } from '../middleware/errorhandler.js';
import { uploadHandler } from '../middleware/upload.js';
import multer from 'multer';
import { ArticleController } from '../controller/articleController.js';

const articleRouter = express.Router();

// 자유게시판 목록 조회 및 생성
articleRouter
  .route('/')
  .get(tryCatchHandler(ArticleController.getArticles))
  .post(validate(CreateArticle), tryCatchHandler(ArticleController.createArticle));
// 자유게시판 상세 조회 및 수정 및 삭제
articleRouter
  .route('/:articleId')
  .get(tryCatchHandler(ArticleController.getArticleDetail))
  .patch(validate(PatchArticle), tryCatchHandler(ArticleController.patchArticle))
  .delete(tryCatchHandler(ArticleController.deleteArticle));

// 자유게시판 이미지 업로드
const upload = multer({ dest: 'articlesUpload/' });
articleRouter.post('/files', upload.single('attachment'), tryCatchHandler(uploadHandler()));

export default articleRouter;
