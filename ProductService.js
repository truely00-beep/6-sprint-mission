import axios from 'axios';
import Product from './Product.js';

const baseURL = `https://panda-market-api-crud.vercel.app`; // /products/   ${baseURL}/products

//=============== 겟 프로덕트 리스트 ============
async function getProductList(page, pageSize, keyword) {
  try {
    const response = await axios.get(baseURL + '/products', {
      params: {
        page,
        pageSize,
        keyword,
      },
    });
    const productData = response.data.list;
    console.log('성공!: ', response.data); //내용 출력
    return productData; //다른곳에서 쓸 수 있게 리턴해준다. ?
  } catch (error) {
    console.error('실패!!!: ', error.message);
    if (error.response) {
      console.log('에러 코드: ', error.response.status);
      console.log('에러 내용: ', error.response.data);
    }
  } finally {
    console.log(`======겟 프로덕트 리스트 테스트 완료======`);
  }
}

//================ 겟 프로덕트 ================

async function getProduct(ID) {
  try {
    const response = await axios.get(baseURL + '/products/' + ID);
    const productData = response.data;
    console.log('성공!: ', productData);
    return productData;
  } catch (error) {
    console.error('실패!!!: ', error.message);
    if (error.response) {
      console.log('에러 코드: ', error.response.status);
      console.log('에러 내용: ', error.response.data);
    }
  } finally {
    console.log('======== 겟 프로닥 실험 끝 ========');
  }
}

//================ 프로덕트 생성 ================
async function createProduct(myProduct) {
  try {
    const response = await axios.post(baseURL + '/products', myProduct);
    const createdProductData = response.data;
    console.log('생성 성공!: ', createdProductData);
  } catch (error) {
    console.error('실패!!!: ', error.message);
    if (error.response) {
      console.log('에러 코드: ', error.response.status);
      console.log('에러 내용: ', error.response.data);
    }
  } finally {
    console.log('======== 생성 실험 끝 ========');
  }
}

//========= 프로덕트 패치하기 ==========
async function patchProduct(ID, myproduct) {
  try {
    const response = await axios.patch(`${baseURL}/products/${ID}`, myproduct);
    const productData = response.data;
    console.log('성공!: ', productData);
  } catch (error) {
    console.error('실패!!!: ', error.message);
    if (error.response) {
      console.log('에러 코드: ', error.response.status);
      console.log('에러 내용: ', error.response.data);
    }
  } finally {
    console.log('======= 프로덕트 패치 실험 끝 =======');
  }
}

// ========= 프로덕트 삭제 =========
async function deleteProduct(ID) {
  try {
    const response = await axios.delete(baseURL + '/products/' + ID);
    const responseData = response.data;
    console.log('성공!: ', responseData);
  } catch (error) {
    console.error('실패!!!: ', error.message);
    if (error.response) {
      console.log('에러 코드: ', error.response.status);
      console.log('에러 내용: ', error.response.data);
    }
  } finally {
    console.log('======= 게시글 삭제 실험 끝 ========');
  }
}

export {
  getProductList,
  getProduct,
  createProduct,
  patchProduct,
  deleteProduct,
};
