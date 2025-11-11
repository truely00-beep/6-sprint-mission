const BASE_URL = 'https://panda-market-api-crud.vercel.app/articles';

// 1. getArticleList() : GET 메소드를 사용해 주세요.
//    ㄴ page, pageSize, keyword 쿼리 파라미터를 이용해 주세요.
export function getArticleList(page, pageSize, keyword) {
  return fetch(
    `${BASE_URL}?page=${page}&pageSize=${pageSize}&keyword=${keyword}`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error(`오류 : ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error(`getArticleList 실패:`, error.message);
    });
}

// 2. getArticle() : GET 메소드를 사용해 주세요.
export function getArticle(id) {
  return fetch(`${BASE_URL}/${id}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `오류: ${response.status} - 게시글 ID(${id}) 조회 실패`
        );
      }
      return response.json();
    })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error(`getArticle 실패`, error.message);
    });
}

//3. createArticle() : POST 메소드를 사용해 주세요.
//request body에 title, content, image 를 포함해 주세요.
export function createArticle(title, content, image) {
  return fetch(`${BASE_URL}`, {
    // post 요청은 method, headers, body 설정하기
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', //보내는 데이터가 json
    },
    body: JSON.stringify({
      //객체를 json 문자열로 변환하여 담기
      title,
      content,
      image,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP 오류: ${response.status} - 게시글 생성 실패..`);
      }
      return response.json();
    })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.log(`createArticle 실패:`, error.message);
      return;
    });
}

// async function runTest() {
//   console.log('게시글 생성 요청 시작...');

//   // createArticle 함수를 호출하고 await으로 결과가 올 때까지 기다립니다.
//   const result = await createArticle(
//     '다리짧은',
//     '먼치킨',
//     'https://example.com/...'
//   );

//   if (result) {
//     console.log('--- 게시글 생성 결과 (성공) ---');
//     console.log(result);
//     // jsonplaceholder.typicode.com의 경우, 실제 서버에 저장되지는 않지만,
//     // 서버가 받은 데이터를 그대로 돌려주며 'id'를 추가해줍니다.
//   } else {
//     console.log('게시글 생성에 실패했습니다. 위의 에러 메시지를 확인하세요.');
//   }
// }
// runTest();

// 4. patchArticle() : PATCH 메소드를 사용해 주세요.
export function patchArticle(id, title, content, image) {
  return fetch(`${BASE_URL}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title,
      content,
      image,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `HTTP 오류: ${response.status} - 게시글 ID(${id}) 수정 실패..`
        );
      }
      return response.json();
    })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.log(`patchArticle 실패:`, error.message);
    });
}

//5. deleteArticle() : DELETE 메소드를 사용해 주세요.
export function deleteArticle(id) {
  return fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `HTTP 오류: ${response.status} - 게시글 ID(${id}) 삭제 실패`
        );
      }
      if (response.status === 204) {
        return null;
      }
      return response.json();
    })
    .then((data) => {
      console.log(`게시글 (ID: ${id}) 삭제 성공!`);
      return data;
    })
    .catch((error) => {
      console.error(`deleteArticle 실패:`, error.message);
    });
}
