import axios from 'axios';

// https://panda-market-api-crud.vercel.app/docs
const baseURL = `https://panda-market-api-crud.vercel.app`;

//-------------getArticleList(1,1,'')------------------------
function getArticleList(page, pageSize, keyword) {
  const q = `?page=${page}&pageSize=${pageSize}&keyword=${keyword}`;
  const finURL = `${baseURL}/articles/${q}`;
  return axios
    .get(finURL)
    .then((response) => {
      console.log(`성공!`, response.data);
    })
    .catch((error) => {
      console.error('실패! :', error.message);
      if (error.response) {
        console.log('에러 코드:', error.response.status);
        console.log('에러 내용:', error.response.data);
      }
    })
    .finally(() => {
      console.log('=====[gerArticleList] 리스트 불러오기 끝====');
    });
}

//------------getArticle(ID)--------------------------------------

function getArticle(ID) {
  return axios
    .get(`${baseURL}/articles/${ID}`)
    .then((response) => {
      console.log('성공! :', response.data);
      return response.data;
    })
    .catch((error) => {
      console.error('실패! :', error.message);
      if (error.response) {
        console.log('에러 코드:', error.response.status);
        console.log('에러 내용:', error.response.data);
      }
    })
    .finally(() => {
      console.log('=====[gerArticle] 게시글 불러오기 끝=====');
    });
}

//------------createArticle--------------------------------------

function createArticle(articleData) {
  return axios
    .post(baseURL + '/articles', articleData)
    .then((response) => {
      return console.log(`성공!!:`, response.data);
    })
    .catch((error) => {
      console.error('실패!!!', error.message);
      if (error.response) {
        console.log('에러 코드:', error.response.status);
        console.log('에러 내용:', error.response.data);
      }
    })
    .finally(() => {
      console.log(`===생성 실험 끝===`);
    });
}

//--------------------patchArticle------------------
function patchArticle(ID, articleData) {
  return axios
    .patch(`${baseURL}/articles/${ID}`, articleData)
    .then((response) => {
      return console.log(`성공!!:`, response.data);
    })
    .catch((error) => {
      console.error(`실패!!!`, error.message);
      if (error.response) {
        console.log('에러 코드:', error.response.status);
        console.log('에러 내용:', error.response.data);
      }
    })
    .finally(() => {
      console.log(`===패치 실험 끝===`);
    });
}

//-----------------deleteArticle----------------------
function deleteArticle(ID) {
  return axios
    .delete(`${baseURL}/articles/${ID}`)
    .then((response) => {
      return console.log(`성공!!:`, response.data);
    })
    .catch((error) => {
      console.log('에러 코드:', error.response.statu);
      console.log('에러 내용:', error.response.data);
    })
    .finally(() => {
      console.log(`=== 게시물 삭제 실험 끝===`);
    });
}

export {
  getArticleList,
  getArticle,
  createArticle,
  patchArticle,
  deleteArticle,
};
