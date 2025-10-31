import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import productRouters from './routes/productRouter.js';
import articleRouters from './routes/articleRouter.js';
import commentRouters from './routes/commentRouter.js';
dotenv.config();

const PORT = process.env.PORT || 4000;
const app = express();

app.use(express.json());
app.use(cors());

app.use('/products', productRouters);
app.use('/articles', articleRouters);
app.use('/comments', commentRouters);

app.listen(PORT, () => {
  console.log('Server running');
});
