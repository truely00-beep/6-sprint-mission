import express from 'express';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('두려워하지 마십시오. 죽음이 끝은 아닙니다.');
});

app.listen(process.env.PORT || 3000, () => {
  console.log('열려라 참깨_시스템[] 항구의 문이 열렸습니다!');
});
