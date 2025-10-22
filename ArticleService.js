import { Article } from './article.mjs';
const url = new URL('https://panda-market-api-crud.vercel.app/articles'); //article 경로

/*
예시 객체
const article1 = new Article(
  '주가 상승',
  '코스닥 주가가 상승했습니다.',
  '김두한'
);
*/

//console.log(article1);

//POST
async function createArticle(article) {
  let res;
  res = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      image: 'https://example.com/...',
      content: article.content,
      title: article.title,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .catch((error) => {
      console.error(error);
      throw new Error('네트워크 전송 중 오류 발생');
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error('생성 오류 발생');
      }
      return response.json();
    })
    .then((data) => {
      console.log('POST 출력');
      console.log(data);
    })
    .catch((error) => {
      console.error(error);
      throw new Error(
        'JSON 파싱 중 오류 발생 (리스폰스 바디가 JSON형식이 아닌경우)'
      );
    });
}

// const data = await createArticle(article1);
// console.log(data);

//GETLIST
async function getArticleList(page, pageSize, keyword) {
  url.searchParams.append('page', page);
  url.searchParams.append('pageSize', pageSize);
  url.searchParams.append('keyword', keyword);

  let res;
  res = await fetch(url)
    .catch((error) => {
      console.error(error);
      throw new Error('네트워크 전송 중 오류 발생');
    })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log('GETLIST 출력');
      console.log(data);
    });
}

//console.log(getArticleList(1, 10, 1));

//GET
async function getArticle(articleId) {
  const getUrl = new URL(
    `https://panda-market-api-crud.vercel.app/articles/${articleId}`
  );
  let res;
  res = await fetch(getUrl)
    .catch((error) => {
      console.error(error);
      throw new Error('네트워크 전송 중 오류 발생');
    })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log('GET 출력');
      console.log(data);
    });
}

// console.log(getArticle(135));

//PATCH
async function patchArticle(articleId, fixedArticle) {
  const patchUrl = new URL(
    `https://panda-market-api-crud.vercel.app/articles/${articleId}`
  );

  let res;
  res = await fetch(patchUrl, {
    method: 'PATCH',
    body: JSON.stringify({
      image: 'https://fixedExample.com/...',
      content: fixedArticle.content,
      title: fixedArticle.title,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .catch((error) => {
      console.error(error);
      throw new Error('네트워크 전송 중 오류 발생');
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error('생성 오류 발생');
      }
      return response.json();
    })
    .then((data) => {
      console.log('PATCH 출력');
      console.log(data);
    });
}

/*
const fixedArticle = new Article(
  '바뀐 test',
  'test가 바뀌었습니다.',
  'testing'
);

console.log(patchArticle(4644, fixedArticle));
*/

//DELETE
async function deleteArticle(articleId) {
  const deleteUrl = new URL(
    `https://panda-market-api-crud.vercel.app/articles/${articleId}`
  );
  let res;
  res = await fetch(deleteUrl, {
    method: 'DELETE',
    body: JSON.stringify(),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .catch((error) => {
      console.error(error);
      throw new Error('네트워크 전송 중 오류 발생');
    })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log('DELETE 출력');
      //console.log(data);
    });
}

//console.log(deleteArticle(4644));
//console.log(getArticleList(1, 1, 1));

const articleService = {
  url,
  getArticleList,
  getArticle,
  createArticle,
  patchArticle,
  deleteArticle,
};

export default articleService;
