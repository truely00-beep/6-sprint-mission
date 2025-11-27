import express from 'express';
import asyncHandler from '../lib/asyncHandler.js';
import * as a from '../controllers/auth-controllers.js';
import * as u from '../controllers/mypage-controllers.js';
import * as ul from '../controllers/mypageList-controllers.js';
import { userCreateValidation } from '../validators/user-validation.js';
import authenticate from '../middleware/authenticate.js';

const authRoute = express.Router();

// ======= ======= ======= ======= =======
// ======= ==== User 인증 기능  ==== =======
// ======= ======= ======= ======= =======

authRoute.post('/register', userCreateValidation, asyncHandler(a.register));
authRoute.post('/login', asyncHandler(a.login));
authRoute.post('/logout', asyncHandler(a.logout));
authRoute.post('/refresh', asyncHandler(a.refreshToken));

// ======= ======= ======= ======= =======
// =======  User 정보 확인/수정 기능  =======
// ======= ======= ======= ======= =======

authRoute.get('/mypage', authenticate, asyncHandler(u.userInfo));
authRoute.patch('/mypage', authenticate, asyncHandler(u.updateUserInfo));
authRoute.patch(
  '/mypage/password',
  authenticate,
  asyncHandler(u.updatePassword)
);

// ======= ======= ======= ======= =======
// = User 작성 product, article, comments =
// ======= ======= ======= ======= =======

authRoute.get(
  '/mypage/products',
  authenticate,
  asyncHandler(ul.getUserCreatedProductsList)
);

authRoute.get(
  '/mypage/articles',
  authenticate,
  asyncHandler(ul.getUserCreatedArticlesList)
);

// 댓글 보기는 시간 남으면 작업 하겠습니다..

export default authRoute;
