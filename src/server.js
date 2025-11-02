import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import productRouters from './routes/productRouter.js';
import articleRouters from './routes/articleRouter.js';
import commentRouters from './routes/commentRouter.js';
import multer from 'multer';
import { errorHandler } from './middlewares/errorHandler/errorHandler.js';
dotenv.config();

const PORT = process.env.PORT || 4000;
const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.json());
app.use(cors());

app.use('/products', productRouters);
app.use('/articles', articleRouters);
app.use('/comments', commentRouters);
app.use('/files', express.static('uploads'));
app.use(errorHandler);

app.post('/uploads', upload.single('attachment'), (req, res) => {
  const { filename } = req.file;
  const path = `/files/${filename}`;
  res.status(200).json({ path });
});

app.listen(PORT, () => {
  console.log('Server running');
});
