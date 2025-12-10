import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import productRouter from './routers/productRouter.js';
import articleRouter from './routers/articleRouter.js';
import commentRouter from './routers/commentRouter.js';
import uploadRouter from './routers/uploadRouter.js';
import { errorHandler } from './middleware/errorHandler.js';
import authRouter from './routers/authRouter.js';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use('/uploads', express.static('uploads'));

app.use('/products', productRouter);
app.use('/articles', articleRouter);
app.use('/comments', commentRouter);
app.use('/upload', uploadRouter);
app.use('/auth', authRouter);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
