import axios from 'axios';

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
    const productData = response.data;
    console.log('성공!:', productData); //내용 출력
    return productData; //다른곳에서 쓸 수 있게 리턴해준다. ?
  } catch (error) {
    console.error('실패!!! :', error.message);
    console.log('에러 코드:', error.response.status);
    console.log('에러 내용:', error.response.data);
  } finally {
    console.log(`======겟 프로덕트 테스트 완료======`);
  }
}

//================ 겟 프로덕트 ================

async function getProduct(ID) {
  try {
    const response = await axios.get(baseURL + '/products' + ID);
    const productData = response.data;
    return productData;
  } catch (error) {
    console.error('실패!!!:', error.message);
    console.log('에러 코드:', error.response.status);
    console.log('에러 내용:', error.response.data);
  } finally {
    console.log('======== 겟 프로닥 실험 끝 ========');
  }
}

export {
  getProductList,
  getProduct,
  // createProduct,
  // patchProduct,
  // deleteProduct,
};
