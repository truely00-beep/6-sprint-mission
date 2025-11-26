import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import productRouters from './router/productRouter.js';
import articleRouters from './router/articleRouter.js';
import commentRouters from './router/commentRouter.js';
import multer from 'multer';
import {
  globalErrorHandler,
  defaultNotFoundHandler,
} from './middlewares/errorHandler/errorHandler.js';
import userRouter from './router/userRouter.js';
import cookieParser from 'cookie-parser';
import { optionalAuth } from './middlewares/auth.js';
dotenv.config();

const PORT = process.env.PORT || 4000;
const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use(optionalAuth);
app.use('/products', productRouters);
app.use('/articles', articleRouters);
app.use('/comments', commentRouters);
app.use('/files', express.static('uploads'));
app.use('/users', userRouter);

app.use(defaultNotFoundHandler);
app.use(globalErrorHandler);

app.post('/uploads', upload.single('image'), (req, res) => {
  const { filename } = req.file;
  const path = `/files/${filename}`;
  res.status(200).json({ path });
});

app.listen(PORT, () => {
  console.log('Server running');
});
