import { getArticleList, getArticle, createArticle } from './ArticleService.js';
import { getProduct, getProductList, PostProduct, patchProduct, deleteProduct } from './ProductService.js';

class Product {
  constructor(name, description, prcie, tags, images) {
    this.name = name;
    this.description = description;
    this.price = prcie;
    this.tags = tags;
    this.images = images;
    this.favoriteCount = 0;
    this.createdAt = new Date();
  }
  favorite() {
    this.favoriteCount += 1;
  }
}

class ElectronicProduct extends Product {
  constructor(name, decription, prcie, tags, images, manufacturerr) {
    super(name, decription, prcie, tags, images);
    this.manufacturerr = manufacturerr;
  }
}

class Article {
  constructor(title, content, writer) {
    this.title = title;
    this.content = content;
    this.writer = writer;
    this.likeCount = 0;
    this.createdAt = new Date();
  }
  like() {
    this.likeCount += 1;
  }
}

const newArticleData = new Article('BH new Article', 'This is content', 'BlueHamster');
const Products = [];
async function DoItArticleThings() {
  const PostCompleteData = await createArticle(newArticleData);
  const articleList = await getArticleList(1, 10, '');
  const article = await getArticle(PostCompleteData.id);
}

async function DoItProductThings() {
  const newProduct = await CreateProduct(
    'BH new Product',
    'This is Product description',
    10000,
    ['전자제품', '컴퓨터'],
    ['https://sampleimage', 'https://thisisimage2'],
    'Samsung'
  );
  const PostCompleteProductData = await PostProduct(newProduct);
  const product = await getProduct(PostCompleteProductData.id);

  if (!product) {
    console.log('상품이 없습니다.');
    return;
  }

  product.description = '가격 2배 이벤트.';
  product.price = 20000;
  const updatedProduct = await patchProduct(product.id, product);
  const isDeleted = await deleteProduct(product.id);
  console.log('삭제 완료:', isDeleted);

  const productList = await getProductList(1, 10, '');
  console.log(productList);

  // productList가 배열일 경우 length 사용
  for (let i = 0; i < productList.list.length; i++) {
    const prod = productList.list[i];
    const newP = await CreateProduct(
      prod.name,
      prod.description,
      prod.price,
      prod.tags,
      prod.images,
      prod.manufacturerr ? prod.manufacturerr : ''
    );
    // 필요한 값만 복사
    newP.createdAt = prod.createdAt;
    Products.push(newP);
  }
  console.log(Products);
}

async function CreateProduct(name, decription, prcie, tags, images, manufacturerr = '') {
  let newProduct;
  if (tags.includes === '전자제품') {
    newProduct = new ElectronicProduct(name, decription, prcie, tags, images, manufacturerr);
  } else {
    newProduct = new Product(name, decription, prcie, tags, images);
  }
  return newProduct;
}

async function DoTest() {
  console.log('Article 관련 함수 시작');
  await DoItArticleThings();
  console.log('Article 관련 함수 종료');
  console.log('Product 관련 함수 시작');
  await DoItProductThings();
  console.log('Product 관련 함수 종료');
}

DoTest();
