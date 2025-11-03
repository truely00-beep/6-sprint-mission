import express from 'express';
import { PORT } from '../constants.js';
import productRouter from './router/productRouter.js';
import articleRouter from './router/articleRouter.js';
import { errorHandler } from './handler/errorHandler.js';
import productCommentRouter from './router/productCommentRouter.js';
import articleCommentRouter from './router/articleCommentRouter.js';
import multer from 'multer';
import uploadRouter from './router/uploadRouter.js';

const app = express();
// app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, this is the API server.');
});

//product
app.use('/products', productRouter);

//article
app.use('/articles', articleRouter);

//comment
app.use('/comments/products', productCommentRouter);

app.use('/comments/articles', articleCommentRouter);

//image
app.use('/files', express.static('uploads'));
app.use('/files', uploadRouter);

app.use(errorHandler);

app.listen(PORT || 3000, () => console.log('Server started'));
