import axios from 'axios';

// https://panda-market-api-crud.vercel.app/docs
const URL = `https://panda-market-api-crud.vercel.app`;

export function getArticleList(page, pageSize, keyword) {
  return axios
    .get(URL + '/articles', {
      params: {
        page,
        pageSize,
        keyword,
      },
    })
    .then((response) => {
      console.log(`성공!`, response.data);
    })
    .catch((error) => {
      console.error('실패! :', error.message);
      if (error.response) {
        console.log(`실패 어쩌구 ${error.response.status}`);
        console.log(error.response.data);
      }
    })
    .finally(() => {
      console.log('=====[gerArticleList] 테스트 완료=====');
    });
}

export function getArticle() {
  return axios
    .get(URL + '/articles', {})
    .then((response) => {
      console.log('성공! :', response.data);
      return response.data;
    })
    .catch((error) => {
      console.error('실패! :', error.message);
      if (error.response) {
        console.log(`${error.response.status}`);
        console.log(error.response.data);
      }
    })
    .finally(() => {
      console.log('=====[gerArticle] 테스트 완료=====');
    });
}

export function createArticle(articleData) {
  const newArticleData = {
    title: '고양이',
    content: '검은 고양이',
    image: 'https://www.catnews.net/bbs/board.php?bo_table=G202&wr_id=55736',
  };
  return axios.post(URL + '/articles', newArticleData);
}

// return axios
// };
// export function patchArticle() {
// return axios
// };
// export function deleteArticle() {
// return axios
// };
