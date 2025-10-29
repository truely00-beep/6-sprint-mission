import express from 'express';
import { PORT } from '../constants.js';
import productRouter from './router/productRouter.js';
import articleRouter from './router/articleRouter.js';
import { errorHandler } from './errorHandler.js';

const app = express();
// app.use(cors());
app.use(express.json());

//product
app.use('/products', productRouter);

//article
app.use('/articles', articleRouter);

app.use(errorHandler);

app.listen(PORT || 3000, () => console.log('Server started'));
