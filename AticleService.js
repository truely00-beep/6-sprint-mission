// ArticleService.js
const ARTICLE_API_BASE_URL =
  "https://panda-market-api-crud.vercel.app/articles";

/**
 * 응답 상태 코드가 2XX가 아닐 경우 에러 메시지를 콘솔에 출력하고 Promise.reject를 반환하는 헬퍼 함수
 * @param {Response} response fetch 응답 객체
 * @returns {Promise<object>} 응답 JSON 데이터
 */
function handleResponseThen(response) {
  if (!response.ok) {
    // 2XX가 아닐 경우 에러 메시지를 콘솔에 출력하고 다음 .catch()로 이동
    return response.text().then((errorText) => {
      console.error(
        `[Error] API 요청 실패: ${response.status} ${response.statusText} - ${errorText}`,
      );
      return Promise.reject(new Error(`API 요청 실패: ${response.status}`));
    });
  }
  return response.json();
}

/**
 * 게시글 목록을 조회합니다.
 * @param {object} params 쿼리 파라미터 객체
 * @param {number} [params.page=1] 페이지 번호
 * @param {number} [params.pageSize=10] 페이지 당 게시글 수
 * @param {string} [params.keyword] 검색 키워드
 * @returns {Promise<object>} 게시글 목록 데이터
 */
export function getArticleList(params = {}) {
  const url = new URL(ARTICLE_API_BASE_URL);
  Object.keys(params).forEach((key) => {
    if (params[key] !== undefined) url.searchParams.append(key, params[key]);
  });

  return fetch(url)
    .then(handleResponseThen)
    .catch((error) => {
      console.error(`getArticleList 오류:`, error.message);
      throw error;
    });
}

/**
 * 특정 게시글을 조회합니다.
 * @param {string} id 게시글 ID
 * @returns {Promise<object>} 게시글 데이터
 */
export function getArticle(id) {
  return fetch(`${ARTICLE_API_BASE_URL}/${id}`)
    .then(handleResponseThen)
    .catch((error) => {
      console.error(`getArticle 오류 (ID: ${id}):`, error.message);
      throw error;
    });
}

/**
 * 새로운 게시글을 생성합니다.
 * @param {object} articleData 생성할 게시글 데이터 (title, content, image)
 * @returns {Promise<object>} 생성된 게시글 데이터
 */
export function createArticle(articleData) {
  return fetch(ARTICLE_API_BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(articleData),
  })
    .then(handleResponseThen)
    .catch((error) => {
      console.error("createArticle 오류:", error.message);
      throw error;
    });
}

/**
 * 게시글 정보를 부분 수정합니다.
 * @param {string} id 게시글 ID
 * @param {object} patchData 수정할 데이터
 * @returns {Promise<object>} 수정된 게시글 데이터
 */
export function patchArticle(id, patchData) {
  return fetch(`${ARTICLE_API_BASE_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patchData),
  })
    .then(handleResponseThen)
    .catch((error) => {
      console.error(`patchArticle 오류 (ID: ${id}):`, error.message);
      throw error;
    });
}

/**
 * 게시글을 삭제합니다.
 * @param {string} id 게시글 ID
 * @returns {Promise<void>}
 */
export function deleteArticle(id) {
  return fetch(`${ARTICLE_API_BASE_URL}/${id}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (!response.ok) {
        console.error(
          `[Error] API 요청 실패: ${response.status} ${response.statusText}`,
        );
        return Promise.reject(new Error(`API 요청 실패: ${response.status}`));
      }
      console.log(`Article ID ${id} 삭제 성공.`);
    })
    .catch((error) => {
      console.error(`deleteArticle 오류 (ID: ${id}):`, error.message);
      throw error;
    });
}
