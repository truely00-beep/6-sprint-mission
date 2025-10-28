import { Article } from './article.js';
import { safeFetch2 } from './fetchFunc2.js';

// //getArticleList() basic ver.
// export function getArticleList(page, pageSize, keyword = '') {
//   const url = new URL('https://panda-market-api-crud.vercel.app/articles');
//   url.searchParams.append('page', page);
//   url.searchParams.append('pageSize', pageSize);
//   url.searchParams.append('keyword', keyword);

//   const res = fetch(url)
//     .then((res) => {
//       if (!res.ok) {
//         throw new Error(`서버 응답 오류: ${res.status} `);
//       }
//       return res.json();
//     })
//     .then((data) => {
//       console.log(data);
//     })
//     .catch((e) => {
//       console.error(e);
//       throw new Error('fetch 오류');
//     })
//     .finally(() => {
//       console.log('함수 종료');
//     });
// }
//공통함수 ver.
export function getArticleList(page, pageSize, keyword = '') {
  const url = new URL('https://panda-market-api-crud.vercel.app/articles');
  url.searchParams.append('page', page);
  url.searchParams.append('pageSize', pageSize);
  if (keyword) url.searchParams.append('keyword', keyword);

  return safeFetch2(url);
}

// //getArticle() basic ver.
// export function getArticle(id) {
//   fetch(`https://panda-market-api-crud.vercel.app/articles/${id}`)
//     .then((res) => {
//       if (!res.ok) {
//         throw new Error(`서버 응답 오류: ${res.status} `);
//       }
//       return res.json();
//     })
//     .then((data) => {
//       console.log(data);
//     })
//     .catch((e) => {
//       console.error(e);
//       throw new Error('fetch 오류');
//     })
//     .finally(() => {
//       console.log('함수 종료');
//     });
// }
//공통함수 ver.
export function getArticle(id) {
  const url = `https://panda-market-api-crud.vercel.app/articles/${id}`;
  return safeFetch2(url);
}

// //createArticle() basic ver.
// export function createArticle(title, content, image) {
//   fetch('https://panda-market-api-crud.vercel.app/articles', {
//     method: 'POST',
//     body: JSON.stringify({
//       title,
//       content,
//       image,
//     }),
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   })
//     .then((res) => {
//       if (!res.ok) {
//         throw new Error(`서버 응답 오류: ${res.status} `);
//       }
//       return res.json();
//     })
//     .then((data) => {
//       console.log(data);
//     })
//     .catch((e) => {
//       console.error(e);
//       throw new Error('fetch 오류');
//     })
//     .finally(() => {
//       console.log('함수 종료');
//     });
// }
// 공통함수 ver.
export function createArticle(title, content, image) {
  const url = 'https://panda-market-api-crud.vercel.app/articles';
  return safeFetch2(url, {
    method: 'POST',
    body: JSON.stringify({
      title,
      content,
      image,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

// //patchArticle() basic ver.
// export function patchArticle(id, title, content, image) {
//   fetch(`https://panda-market-api-crud.vercel.app/articles/${id}`, {
//     method: 'PATCH',
//     body: JSON.stringify({
//       title,
//       content,
//       image,
//     }),
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   })
//     .then((res) => {
//       if (!res.ok) {
//         throw new Error(`서버 응답 오류: ${res.status} `);
//       }
//       return res.json();
//     })
//     .then((data) => {
//       console.log(data);
//     })
//     .catch((e) => {
//       console.error(e);
//       throw new Error('fetch 오류');
//     })
//     .finally(() => {
//       console.log('함수 종료');
//     });
// }
// 공통함수 ver.
export function patchArticle(id, title, content, image) {
  const url = `https://panda-market-api-crud.vercel.app/articles/${id}`;
  return safeFetch2(url, {
    method: 'PATCH',
    body: JSON.stringify({
      title,
      content,
      image,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

// //deleteArticle() basic ver.
// export function deleteArticle(id) {
//   fetch(`https://panda-market-api-crud.vercel.app/articles/${id}`, {
//     method: 'DELETE',
//   })
//     .then((res) => {
//       if (!res.ok) {
//         throw new Error(`서버 응답 오류: ${res.status} `);
//       }
//       return res.json();
//     })
//     .then((data) => {
//       console.log(data);
//     })
//     .catch((e) => {
//       console.error(e);
//       throw new Error('fetch 오류');
//     })
//     .finally(() => {
//       console.log('함수 종료');
//     });
// }
//공통함수 ver.
export function deleteArticle(id) {
  const url = `https://panda-market-api-crud.vercel.app/articles/${id}`;
  return safeFetch2(url, {
    method: 'DELETE',
  });
}
