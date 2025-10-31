import express from 'express';
import cors from 'cors';
import productRouters from './routes/productRouter.js';
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 4000;
const app = express();

app.use(express.json());
app.use(cors());

app.use('/products', productRouters);

app.listen(PORT, () => {
  console.log('Server running');
});
