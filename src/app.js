import express from 'express';
import errorHandler from './middlewares/errorHandler.js';
import productRouter from './routers/productRouter.js';
import articleRouter from './routers/articleRouter.js';

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('두려워하지 마십시오. 죽음이 끝은 아닙니다.');
});

//중고마켓
app.use('/products', productRouter);
// app.use('/product/:id', productRouter);

//자유게시판
app.use('/articles', articleRouter);
// app.use('/article/:id', articleRouter);

//마지막에 실행.
app.use(errorHandler);

app.listen(process.env.PORT || 3000, () => {
  console.log(`열려라 참깨! 시스템: ${PORT} 문이 열립니다. ( b^-^)b`);
});
