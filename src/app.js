import express from 'express';

const app = express();
const PORT = 3000;

app.use(express.json());

//중고마켓
/*app.use('/products', productsRouter) */
//자유게시판
/* */
//필수
app.get('/', (req, res) => {
  res.send('두려워하지 마십시오. 죽음이 끝은 아닙니다.');
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`열려라 참깨! 시스템: ${PORT} 문이 열립니다. ( b^-^)b`);
});
