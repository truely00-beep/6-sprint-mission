import articleService from './ArticleService.js';
import { Article } from './article.mjs';
import productService from './ProductService.js';
import { Product, ElectronicProduct } from './product.mjs';

const article1 = new Article(
  '주가 하락',
  '코스닥 주가가 하락했습니다.',
  '김두한'
);

const article2 = new Article(
  '주가 동결',
  '코스닥 주가가 그대로입니다.',
  '김두한'
);

console.log('=====Article 생성 및 출력=====');
//POST article1
await articleService.createArticle(article1);

//GETLIST article1->list에서 쿼리파라미터로 페이지를 나누고, keyword를 이용해 특정 기사 찾기
await articleService.getArticleList(1, 10, '주가');

//Get article ->article1의 ID를 통해 데이터베이스에서 article1의 데이터를 찾아 출력
await articleService.getArticle(4778);

//PATCH article1-> article1의 ID를 통해 title과 contents를 article2에 있는 title, contents로 변경
//await articleService.patchArticle(4778, article2);

//DELETE article1 -> article1의 ID를 통해 article1을 데이터에서 삭제
//await articleService.deleteArticle(4778);

const product1 = new Product(
  '휴대폰',
  '휴대폰입니다.',
  200000,
  ['전자제품'],
  'https://phone.com/...'
);

const product2 = new Product(
  '노트북',
  '노트북입니다.',
  250000,
  ['전자제품'],
  'https://labtop.com/...'
);

console.log('===Product 생성 및 출력 등등===');

//POST product1
console.log(await productService.createProduct(product1));

//GET product1->id를 이용해 특정 위치의 data 출력
console.log(await productService.getProduct(2363));

//PATCH product1->id를 이용해 편집할 data 위치를 찾고, 다른 data로 변경
console.log(await productService.patchProduct(2363, product2));

//DELETE product1->id를 이용해 삭제할 data의 위치를 찾고 삭제;
//console.log(await productService.deleteProduct(2359));

//makeListToInstance -> GETLIST 매서드를 이용해서 특정 목록을 지정해서 그 내부에 있는 product data를 tag로 구분하여 각각의 인스턴스로 만든 후 products 배열에 저장

console.log(
  await productService.makeListToInstance(1, 5, '노트북', '전자제품', '삼성')
);
