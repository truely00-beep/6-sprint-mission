import Product from './Product.js';
import ElectronicProduct from './ElectronicProduct.js';
import Article from './Article.js';
import {
  getArticleList,
  getArticle,
  createArticle,
  patchArticle,
  deleteArticle,
} from './ArticleService.js';
import { getProduct, getProductList } from './ProductService.js';

//------------------------------------------------------------

const powerNeo = new ElectronicProduct(
  '네오 건전지',
  '평범한 건전지이다...',
  5500,
  [],
  [],
  0
);

//----올릴 포스트/패치 내용 쓰는 곳----
// const articleData = {
//   title: '검은 고양이',
//   content: '검은 고양이',
//   image:
//     'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdlFJ7CNFqVBVVHTq3Vjfio8TTIFoktx9-sQ&s',
// };

//--------------리스트 가져오기--------------
// getArticleList(1, 10, '고양이');

//----------------고양이 포스트하기----------------------
// createArticle(articleData);

//-------------- 포스트 한것 구하기--------------4715, 4718 ,34,35,36
// getArticle(4715);

// ---------------patch 하기-----------------4718
// patchArticle(4715, articleData);

//-----------------delete--------------4734, 35, 36
// deleteArticle(4734);
// deleteArticle(4735);
// deleteArticle(4736);

console.log('=====테스트 시작=====');
//============ getProductList (page, pageSize, keyword) ==========
// getProductList(1, 10, '');

//======= 겟 프로덕트(ID) =======
// getProduct();

//======= 프로덕트 생성 ========

//예시 가구
const myNewProduct = new Product(
  '마하의 관',
  '보이드의 방주 안에 실려있던 관을 본뜬 침대.',
  900000,
  ['가구'],
  ['https://upload2.inven.co.kr/upload/2016/09/29/data/i13735191954.png']
);
