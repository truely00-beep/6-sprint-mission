import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import productRouters from './routes/productRouter.js';
import articleRouters from './routes/articleRouter.js';
dotenv.config();

const PORT = process.env.PORT || 4000;
const app = express();

app.use(express.json());
app.use(cors());

app.use('/products', productRouters);
app.use('/articles', articleRouters);

app.listen(PORT, () => {
  console.log('Server running');
});
