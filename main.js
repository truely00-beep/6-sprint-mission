import { Article, Product } from './models.js';
import {
  getArticleList,
  createArticle,
  patchArticle,
  deleteArticle,
} from './ArticleService.js';
import {
  getProductList,
  createProduct,
  patchProduct,
  deleteProduct,
} from './ProductService.js';

console.log('=== 테스트 시작 ===');

// ✅ Article 생성
const newArticle = await createArticle({
  title: '컴퓨터',
  content: '전자제품. 가전',
  image: 'https://placehold.co/300x200',
});
console.log('✅ Created Article:', newArticle);

// ✏️ Article 수정
const patchedArticle = await patchArticle(newArticle.id, {
  title: 'TV',
});
console.log('✏️ Patched Article:', patchedArticle);

// 🗑️ Article 삭제
const deletedArticle = await deleteArticle(newArticle.id);
console.log('🗑️ Deleted Article:', deletedArticle);

// 🛒 Product 리스트 출력
const products = await getProductList();
if (Array.isArray(products) && products.length > 0) {
  console.log(
    '🛒 Products:',
    products.map((p) => p.toJSON())
  );
} else {
  console.log('🛒 Products: (현재 등록된 상품 없음)');
}

// 💖 Product favorite
const testProduct = new Product(
  '컴퓨터',
  '전자제품',
  1000,
  ['태그'],
  ['https://placehold.co/200']
);
console.log('💖 Before favorite:', testProduct.favoriteCount);
testProduct.favorite();
console.log('💖 After favorite:', testProduct.favoriteCount);

// 📄 Article 리스트 출력
const articleList = await getArticleList(1, 3);
console.log('📄 Articles:', articleList);

// 👍 Article like
const testArticle = new Article('전자제품', '가전', '양동섭');
console.log('👍 Before like:', testArticle.likeCount);
testArticle.like();
console.log('👍 After like:', testArticle.likeCount);

// ✅ Product 생성
const newProduct = await createProduct({
  name: '컴퓨터',
  description: '이 상품은 전자제품입니다.',
  price: 15000,
  tags: ['컴퓨터', '전자제품', '가전'],
  images: ['https://placehold.co/400x300'],
});
console.log('✅ Created Product:', newProduct);

// ✏️ Product 수정
const patchedProduct = await patchProduct(newProduct.id, { price: 20000 });
console.log('✏️ Patched Product:', patchedProduct);

// 🗑️ Product 삭제
const deletedProduct = await deleteProduct(newProduct.id);
console.log('🗑️ Deleted Product:', deletedProduct);
