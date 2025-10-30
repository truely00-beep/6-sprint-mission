import express from 'express';
import 'express-async-errors';
import { PORT } from './utils/constants.js';
import productRouter from './routers/productsRouter.js';
import { errorHandlerMiddleware } from './middlewares/errorHandler.js';

const app = express();
app.use(express.json());

app.use('/products', productRouter);
app.use(errorHandlerMiddleware);

app.listen(PORT, () => console.log('서버 시작'));
