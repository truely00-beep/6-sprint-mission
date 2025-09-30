import axios from 'axios';

const baseURL = `https://panda-market-api-crud.vercel.app`; // /products/   ${baseURL}/products

/*
getProductList()
getProduct()
createProduct()
patchProduct()
deleteProduct()


*/
//==========겟 프로덕트 리스트=======
export async function getProductList(page, pageSize, keyword) {
  const q = `?page=${page}&pasgeSize=${pageSize}&keyword=${keyword}`;
  const finURL = `${baseURL}/products/${q}`;
  try {
    const response = await axios.get(`${baseURL}/products`);
    console.log(`성공!!! : ${response.data}`);
  } catch (error) {
    console.error(`실패!!! : ${error.message}`);
    console.log(`오류 코드: ${error.response.status}`);
  } finally {
    console.log(`=====겟 프로덕트 테스트 완료=====`);
  }
}
