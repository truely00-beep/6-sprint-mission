// 초기 await 버전
// export async function getArticleList(page = '1', pageSize = '10', keyword = '') {
//   try {
//     const data = await fetch(
//       `https://panda-market-api-crud.vercel.app/articles?page=${page}&pageSize=${pageSize}&orderBy=recent&keyword=${keyword}`
//     );
//     const body = await data.json();
//     console.log('=====getArticleListData=====');
//     if (!data.ok) {
//       console.error(`전송 상태 에러: ${data.status}`);
//       throw new Error(`Error`);
//     }
//     console.log(body);
//     console.log('=====getArticleListData End=====');
//     return body;
//   } catch (error) {
//     console.error(error);
//     throw new Error('에러 발생');
//   }
// }

export function getArticleList(page = '1', pageSize = '10', keyword = '') {
  console.log('=====getArticleListData=====');
  return fetch(
    `https://panda-market-api-crud.vercel.app/articles?page=${page}&pageSize=${pageSize}&orderBy=recent&keyword=${keyword}`
  )
    .then((res) => {
      if (!res.ok) {
        console.error(`전송 상태 에러: ${res.status}`);
        throw new Error(`Error`);
      }
      return res.json();
    })
    .then((body) => {
      console.log(body);
      console.log('=====getArticleListDataEND=====');
      return body;
    })
    .catch((error) => {
      console.error('에러코드:' + error.status);
      throw new Error('에러 발생');
    });
}

export async function getArticle(articleId) {
  return fetch(`https://panda-market-api-crud.vercel.app/articles/${articleId}`)
    .then((res) => {
      if (!res.ok) {
        console.error(`전송 상태 에러: ${res.status}`);
        throw new Error(`전송 상태 에러`);
      }
      return res.json();
    })
    .then((body) => {
      console.log(body);
      console.log('=====getArticleData End=====');
      return body;
    })
    .catch((error) => {
      console.error(error);
      throw error;
    });
  // 초기 await 버전
  // try {
  //   const data = await fetch(`https://panda-market-api-crud.vercel.app/articles/${articleId}`);
  //   console.log('=====getArticleData=====');
  //   const body = await data.json();
  //   if (!data.ok) {
  //     console.error(`전송 상태: ${data.status}`);
  //     throw new Error(`전송 상태 에러`);
  //   }
  //   console.log(body);
  //   console.log('=====getArticleData End=====');
  //   return data;
  // } catch (error) {
  //   console.error(error);
  //   throw error;
  // }
}
export async function createArticle(articleData) {
  try {
    const _Data = {
      title: articleData.title,
      content: articleData.content,
      image: articleData.image,
    };

    const res = await fetch('https://panda-market-api-crud.vercel.app/articles/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(_Data),
    });
    if (!res.ok) {
      console.error(`전송 상태 에러: ${res.status}`);
      throw new Error('전송 상태 에러');
    }
    const data = await res.json();
    console.log('=====PostArticleData=====');
    console.log(data);
    console.log('=====PostArticleData End=====');
    return data;
  } catch (error) {
    console.error(error);
    throw new Error('에러 발생');
  }
}
