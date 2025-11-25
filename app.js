import express from 'express';
import cookieParser from 'cookie-parser';

import cors from 'cors';
import errorHandler from './lib/errorhandler.js';
import { PORT } from './lib/constants.js';

import imgRouter from './routers/imgRoute.js';
import authRoute from './routers/authRoute.js';
import productRoute from './routers/productRoute.js';
import articleRoute from './routers/articleRoute.js';
import mypageRoute from './routers/mypageRoute.js';

const app = express();

app.use(cors());
app.use(express.json());

// 토큰 작업
app.use(cookieParser());

// 이미지 Multer 먼저 실행
app.use('/files', imgRouter);
app.use('/files', express.static('files'));

// 각각 route 작업
app.use('/auth', authRoute);
app.use('/products', productRoute);
app.use('/articles', articleRoute);
app.use('/mypage', mypageRoute);

// comment CRUD 작업은 product, article에서 직접 작업 진행
// app.use('/comments', commentRoute);

app.use(errorHandler);

app.listen(PORT, (req, res) => {
  console.log('start app!!!');
});
