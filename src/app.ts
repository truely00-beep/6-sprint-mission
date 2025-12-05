import express from 'express';
import cookieParser from 'cookie-parser';
import { PORT } from './lib/constants';
import productRouter from './router/productRouter';
import articleRouter from './router/articleRouter';
import { defaultNotFoundHandler, errorHandler } from './handler/errorHandler';
import commentRouter from './router/commentRouter';
import uploadRouter from './router/uploadRouter';
import userRouter from './router/userRouter';
import authRouter from './router/authRouter';

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

//auth
app.use('/auth', authRouter);

//user
app.use('/user', userRouter);

app.use(defaultNotFoundHandler);
app.use(errorHandler);

app.listen(PORT || 3000, () => console.log('Server started'));
