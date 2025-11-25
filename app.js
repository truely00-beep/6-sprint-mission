import express from 'express';
import { productRoute } from './routers/productRoute.js';
import { articleRoute } from './routers/articleRoute.js';
// import { commentRoute } from './routers/_commentRoute.js';
import { imgRouter } from './routers/imgRoute.js';

import cors from 'cors';
import errorHandler from './lib/errorhandler.js';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// 이미지 Multer 먼저 실행
app.use('/files', imgRouter);
app.use('/files', express.static('files'));

// 각각 route 작업
app.use('/products', productRoute);
app.use('/articles', articleRoute);

// comment CRUD 작업은 product, article에서 직접 작업 진행
// app.use('/comments', commentRoute);

app.use(errorHandler);

app.listen(port, (req, res) => {
  console.log('start app!!!');
});
