import express from 'express';
import cookieParser from 'cookie-parser';
import { PORT } from '../constants.js';
import productRouter from './router/productRouter.js';
import articleRouter from './router/articleRouter.js';
import { defaultNotFoundHandler, errorHandler } from './handler/errorHandler.js';
import commentRouter from './router/commentRouter.js';
import uploadRouter from './router/uploadRouter.js';
import userRouter from './router/userRouter.js';

const app = express();
// app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, this is the API server.');
});

//product
app.use('/products', productRouter);

//article
app.use('/articles', articleRouter);

//comment
app.use('/comments', commentRouter);

//image
app.use('/files', express.static('uploads'));
app.use('/files', uploadRouter);

//user
app.use('/user', userRouter);

app.use(defaultNotFoundHandler);
app.use(errorHandler);

app.listen(PORT || 3000, () => console.log('Server started'));
