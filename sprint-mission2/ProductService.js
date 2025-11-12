import { Product } from './product.js';
import { ElectronicProduct } from './electronicProduct.js';
import { safeFetch } from './fetchFunc.js';

// //getProductList() basic ver.
// export async function getProductList(page, pageSize, keyword = '') {
//   let res;
//   try {
//     //console.log('fetch전');
//     const url = new URL('https://panda-market-api-crud.vercel.app/products');
//     url.searchParams.append('page', page);
//     url.searchParams.append('pageSize', pageSize);
//     if (keyword) url.searchParams.append('keyword', keyword);

//     res = await fetch(url);
//   } catch (e) {
//     console.error(e);
//     throw new Error('네트워크 전송 오류');
//   }
//   if (!res.ok) {
//     throw new Error('생성 오류 발생');
//   }
//   //console.log('fetch 후');

//   try {
//     const data = await res.json();
//     //console.log('출력');
//     return data;
//   } catch (e) {
//     console.error(e);
//     throw new Error('파싱 오류');
//   } finally {
//     console.log('실행 완료');
//   }
// }
// 공통함수 ver.
export async function getProductList(page, pageSize, keyword = '') {
  const url = new URL(`https://panda-market-api-crud.vercel.app/products`);
  url.searchParams.append('page', page);
  url.searchParams.append('pageSize', pageSize);
  if (keyword) url.searchParams.append('keyword', keyword);

  return await safeFetch(url);
}

// //getProduct() 기본 버전
// export async function getProduct(id) {
//   let res;
//   try {
//     res = await fetch(
//       `https://panda-market-api-crud.vercel.app/products/${id}`
//     );
//   } catch (e) {
//     console.error(e);
//     throw new Error('네트워크 전송 오류');
//   }
//   if (!res.ok) {
//     throw new Error('생성 오류 발생');
//   }

//   try {
//     const data = await res.json();
//     return data;
//   } catch (e) {
//     console.error(e);
//     throw new Error('파싱 오류');
//   } finally {
//     console.log('실행 완료');
//   }
// }
//fetch 공통함수 ver.
export async function getProduct(id) {
  const url = `https://panda-market-api-crud.vercel.app/products/${id}`;
  return await safeFetch(url);
}

// //createProduct() basic ver.
// export async function createProduct(name, description, price, tags, images) {
//   let res;
//   try {
//     res = await fetch(`https://panda-market-api-crud.vercel.app/products`, {
//       method: 'POST',
//       body: JSON.stringify({
//         name,
//         description,
//         price,
//         tags,
//         images,
//       }),
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });
//   } catch (e) {
//     console.error(e);
//     throw new Error('네트워크 전송 오류');
//   }
//   if (!res.ok) {
//     throw new Error('생성 오류 발생');
//   }

//   try {
//     const data = await res.json();
//     return data;
//   } catch (e) {
//     console.error(e);
//     throw new Error('파싱 오류');
//   } finally {
//     console.log('실행 완료');
//   }
// }
// 공통함수 ver.
export async function createProduct(name, description, price, tags, images) {
  const url = `https://panda-market-api-crud.vercel.app/products`;
  return await safeFetch(url, {
    method: 'POST',
    body: JSON.stringify({
      name,
      description,
      price,
      tags,
      images,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

// //patchProduct() basic ver.
// export async function patchProduct(id, name, description, price, tags, images) {
//   let res;
//   try {
//     res = await fetch(
//       `https://panda-market-api-crud.vercel.app/products/${id}`,
//       {
//         method: 'PATCH',
//         body: JSON.stringify({
//           name: name,
//           description: description,
//           price: price,
//           tags: tags,
//           images: images,
//         }),
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       }
//     );
//   } catch (e) {
//     console.error(e);
//     throw new Error('네트워크 전송 오류');
//   }
//   if (!res.ok) {
//     throw new Error('생성 오류 발생');
//   }

//   try {
//     const data = await res.json();
//     return data;
//   } catch (e) {
//     console.error(e);
//     throw new Error('파싱 오류');
//   } finally {
//     console.log('실행 완료');
//   }
// }
//공통함수 ver.
export async function patchProduct(id, name, description, price, tags, images) {
  const url = `https://panda-market-api-crud.vercel.app/products/${id}`;
  return await safeFetch(url, {
    method: 'PATCH',
    body: JSON.stringify({
      name,
      description,
      price,
      tags,
      images,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

// //deleteProduct basic ver.
// export async function deleteProduct(id) {
//   let res;
//   try {
//     res = await fetch(
//       `https://panda-market-api-crud.vercel.app/products/${id}`,
//       {
//         method: 'DELETE',
//       }
//     );
//   } catch (e) {
//     console.error(e);
//     throw new Error('네트워크 전송 오류');
//   }
//   if (!res.ok) {
//     throw new Error('생성 오류 발생');
//   }

//   try {
//     const data = await res.json();
//     return data;
//   } catch (e) {
//     console.error(e);
//     throw new Error('파싱 오류');
//   } finally {
//     console.log('실행 완료');
//   }
// }

//공통함수 ver.
export async function deleteProduct(id) {
  const url = `https://panda-market-api-crud.vercel.app/products/${id}`;
  return await safeFetch(url, {
    method: 'DELETE',
  });
}
