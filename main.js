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
import {
  getProduct,
  getProductList,
  createProduct,
  deleteProduct,
  patchProduct,
} from './ProductService.js';

//------------------------------------------------------------
console.log('=====테스트 시작=====');

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

//-------------------------------------------------delete-------------------------------------------------------------------4734, 35, 36
// deleteArticle(4734);
// deleteArticle(4735);
// deleteArticle(4736);

//============ getProductList (page, pageSize, keyword) ==========
// getProductList(1, 10, '');

//======= 겟 프로덕트(ID) =======
// getProduct(1234);

//======= 프로덕트 생성 ========
// const myProduct = new Product(
//   '낡은 이어폰',
//   '언제 산 건지 모를 이어폰이다...',
//   '5000',
//   ['전자제품'],
//   []
// );
// createProduct(myProduct);

//============== 프로덕트 패치 ==============
// patchProduct(2407, myProduct);

//======= delete product ======= 2405
// deleteProduct();
// deleteProduct();

//======== instance 어쩌구 저쩌구 ==================
const products = [];

async function 테스트() {
  try {
    let temp = [];
    temp = await getProductList(1, 10, '');
    temp.forEach((item) => {
      let instance;
      if (item.tags && item.tags.includes('전자제품')) {
        instance = new ElectronicProduct(
          item.name,
          item.description,
          item.price,
          item.tags,
          item.image,
          item.favoriteCount,
          item.manufacturer
        );
      } else {
        instance = new Product(
          item.name,
          item.description,
          item.price,
          item.tags,
          item.image,
          item.favoriteCount
        );
      }
      products.push(instance);
    });
    console.log('성공!: ', products);
  } catch (error) {
    console.error('실패!!!: ', error.message);
  } finally {
    console.log('========= 테스트 끝 =======');
  }
}

테스트();
