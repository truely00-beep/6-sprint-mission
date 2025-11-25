import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import { PORT } from './utils/constants.js';
import cookieParser from 'cookie-parser';
import authRouter from './routers/authRouter.js';

import productRouter from './routers/productsRouter.js';
import articleRouter from './routers/articlesRouter.js';
import commentRouter from './routers/commentsRouter.js';
import imageRouter from './routers/imagesRouter.js';

import { errorHandlerMiddleware } from './middlewares/errorHandler.js';

const app = express();

app.use(cors());

app.use('/files', express.static('uploads'));
app.use('/images', imageRouter);

app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRouter);
app.use('/articles', articleRouter);
app.use('/products', productRouter);
app.use('/comments', commentRouter);

app.use(errorHandlerMiddleware);

app.listen(PORT, () => console.log('서버 시작'));
