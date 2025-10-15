import axios from 'axios';
import { Product, ElectronicProduct } from './product.mjs';

const instance = axios.create({
  baseURL: 'https://panda-market-api-crud.vercel.app',
  timeout: 10000,
});

async function createProduct(product) {
  let res;

  try {
    res = await instance.post('/products', {
      name: product.name,
      description: product.description,
      price: product.price,
      tags: product.tags,
      images: product.images,
    });
  } catch (e) {
    if (e.response) {
      console.log(e.response.status);
      console.log(e.response.data);
      throw new Error('생성 오류 발생');
    } else if (e.request) {
      console.log('리퀘스트는 전송 되었으나 응답이 오지 않는 오류 발생');
    } else {
      console.log('그 외 오류');
    }
  }

  const data = res.data;
  return data;
}

async function getProductList(page, pageSize, keyword) {
  let res;

  try {
    res = await instance.get('/products', {
      params: {
        page: page,
        pageSize: pageSize,
        keyword: keyword,
      },
    });
  } catch (e) {
    if (e.request) {
      console.log('리퀘스트는 전송 되었으나 응답이 오지 않는 오류 발생');
    } else {
      console.log('그 외 오류');
    }
  }

  const data = res.data;
  return data.list;

  //axios를 통해 API에서 추출한 데이터 형식은 object형식
  //보통 list와 totalCount(list의 갯수)가 추출됨
  //이를 통해 ~~.list를 해서 object 내에 있는 list만 추출해서 배열등으로 사용이 가능해짐
}

async function getProduct(productId) {
  let res;

  try {
    res = await instance.get(`/products/${productId}`);
  } catch (e) {
    if (e.request) {
      console.log('리퀘스트는 전송 되었으나 응답이 오지 않는 오류 발생');
    } else {
      console.log('그 외 오류');
    }
  }

  const data = res.data;
  return data;
}

//timeout을 3000으로 하면 안되고, 5000이상으로 둬야 작동을 함
async function patchProduct(productId, fixedProduct) {
  let res;

  try {
    res = await instance.patch(`/products/${productId}`, {
      name: fixedProduct.name,
      description: fixedProduct.description,
      price: fixedProduct.price,
      tags: fixedProduct.tags,
      images: fixedProduct.images,
    });
  } catch (e) {
    if (e.response) {
      console.log(e.response.status);
      console.log(e.response.data);
      throw new Error('생성 오류 발생');
    } else if (e.request) {
      console.log('리퀘스트는 전송 되었으나 응답이 오지 않는 오류 발생');
    } else {
      console.log('그 외 오류');
    }
  }

  const data = res.data;
  return data;
}

async function deleteProduct(productId) {
  let res;

  try {
    res = await instance.delete(`/products/${productId}`);
  } catch (e) {
    if (e.request) {
      console.log('리퀘스트는 전송 되었으나 응답이 오지 않는 오류 발생');
    } else {
      console.log('그 외 오류');
    }
  }

  const data = res.data;
  return data;
}

//ID : 2293
//patchProduct(2284, product2);
//deleteProduct(2284);

const products = [];

async function makeListToInstance(
  page,
  pageSize,
  keyword,
  findTag,
  manufacturer
) {
  const listData = await getProductList(page, pageSize, keyword);

  for (let key of listData) {
    if (key.tags.find((tag) => tag === findTag)) {
      products.push(
        new ElectronicProduct(
          key.name,
          key.description,
          key.price,
          key.tags,
          key.images,
          key.favoriteCount,
          manufacturer
        )
      );
    } else {
      products.push(
        new Product(key.name, key.description, key.price, key.tags, key.images)
      );
    }
  }

  return products;
}

const productService = {
  instance,
  createProduct,
  getProductList,
  getProduct,
  patchProduct,
  deleteProduct,
  makeListToInstance,
};

export default productService;
