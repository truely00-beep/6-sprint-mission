import express from 'express';
import { withAsync } from '../lib/withAsync.js';
import {
  getMe,
  updateMe,
  updateMyPassword,
  getMyProductList,
} from '../controllers/usersController.js';
import authenticate from '../middlewares/authenticate.js';

const usersRouter = express.Router();

// 유저가 자신의 정보를 조회하는 기능을 구현합니다.
usersRouter.get('/me', authenticate(), withAsync(getMe));

// 유저가 자신의 정보를 수정할 수 있는 기능을 구현합니다.
usersRouter.patch('/me', authenticate(), withAsync(updateMe));

// 유저가 자신의 비밀번호를 변경할 수 있는 기능을 구현합니다.
usersRouter.patch('/me/password', authenticate(), withAsync(updateMyPassword));

// 유저가 자신이 등록한 상품의 목록을 조회하는 기능을 구현합니다.
usersRouter.get('/me/products', authenticate(), withAsync(getMyProductList));

export default usersRouter;