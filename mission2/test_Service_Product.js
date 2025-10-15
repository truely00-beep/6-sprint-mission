import {
  getProductList,
  getProduct,
  createProduct,
  patchProduct,
  deleteProduct,
} from './service/Service_Product.js';

let product;

//------------------------------- getProductList(params)
const params = {
  page: 1,
  pageSize: 5,
  orderBy: 'recent',
  //keyword: '꼴랑꼴랑',
};
product = await getProductList(params);
//product = await getProductList();

//------------------------------- getProduct(id)
//product = await getProduct(2460);
//product = await getProduct(1); // error test: 404 file not found

//------------------------------- createProduct(productData)
const productData = {
  name: 'iPhone 17 Pro',
  description: '15.9cm, Super Retina XDR 디스플레이, 8배 광학 줌 전면 카메라',
  price: 1790000,
  tags: ['전자제품'], // only 1 tag is allowed
  images: 'https://www.apple.com/kr/shop/buy-iphone/iphone-17-pro',
  //manufacturer: 'Apple',
};

//product = await createProduct(productData);

//------------------------------- patchProduct(id, productData)
//product = await patchProduct(2517, productData);

//------------------------------- deleteProduct(id)
//product = await deleteProduct(2519);

if (product) console.log(product);
console.log('');
