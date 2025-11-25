import express from 'express';
import asyncHandler from '../lib/asynchandler.js';
import * as a from '../controllers/article-controllers.js';
import * as ac from '../controllers/articleComment-controllers.js';

import {
  articleCreateValidation,
  articleUpdateValidation,
} from '../lib/article_validation.js';

import {
  commentCreateValidation,
  commentUpdateValidation,
} from '../lib/comment_validation.js';

const articleRoute = express.Router();

articleRoute.get('/', asyncHandler(a.articlesList));
articleRoute.post('/', articleCreateValidation, asyncHandler(a.articleNew));

articleRoute.get('/:id', asyncHandler(a.articleOnly));
articleRoute.patch(
  '/:id',
  articleUpdateValidation,
  asyncHandler(a.articleUpdate)
);
articleRoute.delete('/:id', asyncHandler(a.articleDelete));

// ======= article에 연결 된 comment =======
// article와 comment가 별도의 모델로 구동되므로
// 별도의 작업으로 제작 하였습니다

articleRoute.get(
  '/:articleId/articlecomments',
  asyncHandler(ac.articleCommentsList)
);
articleRoute.post(
  '/:articleId/articlecomments',
  commentCreateValidation,
  asyncHandler(ac.articleCommentNew)
);

articleRoute.patch(
  '/:articleId/articlecomments/:commentId',
  commentUpdateValidation,
  asyncHandler(ac.articleCommentUpdate)
);
articleRoute.delete(
  '/:articleId/articlecomments/:commentId',
  asyncHandler(ac.articleCommentDelete)
);

export default articleRoute;
