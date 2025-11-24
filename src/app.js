import express from 'express';
import { PORT } from '../constants.js';
import productRouter from './router/productRouter.js';
import articleRouter from './router/articleRouter.js';
import { errorHandler } from './handler/errorHandler.js';
import commentRouter from './router/commentRouter.js';
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
app.use('/comments', commentRouter);

//image
app.use('/files', express.static('uploads'));
app.use('/files', uploadRouter);

app.use(errorHandler);

app.listen(PORT || 3000, () => console.log('Server started'));
