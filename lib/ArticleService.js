// ArticleService.js
import axios from "axios";

// axios 인스턴스 생성
const http = axios.create({
  baseURL: "https://panda-market-api-crud.vercel.app",
  timeout: 10000, // 10초 타임아웃 추가
  headers: {
    "Content-Type": "application/json",
  },
});

// 응답 인터셉터로 공통 에러 처리
http.interceptors.response.use(
  (response) => response,
  (error) => {
    // 네트워크 오류
    if (!error.response) {
      console.error("[Article API] 네트워크 오류:", error.message);
      throw new Error("네트워크 연결을 확인해주세요.");
    }

    // HTTP 에러
    const { status, statusText, data } = error.response;
    console.error(`[Article API Error] ${status} ${statusText}`);
    if (data) console.error("상세 에러:", data);

    // 에러 객체 개선
    const enhancedError = new Error(`API 요청 실패: ${status} ${statusText}`);
    enhancedError.status = status;
    enhancedError.data = data;
    throw enhancedError;
  }
);

// 쿼리 파라미터 검증
const ARTICLE_ORDER_BY = new Set(["recent", "like"]);

function buildQueryParams({
  page = 1,
  pageSize = 10,
  keyword = "",
  orderBy = "recent",
} = {}) {
  // 파라미터 유효성 검증
  const validPage = Math.max(1, parseInt(page) || 1);
  const validPageSize = Math.min(100, Math.max(1, parseInt(pageSize) || 10));
  const validOrderBy = ARTICLE_ORDER_BY.has(orderBy) ? orderBy : "recent";

  const params = {
    page: validPage,
    pageSize: validPageSize,
    orderBy: validOrderBy,
  };

  if (keyword && keyword.trim()) {
    params.keyword = keyword.trim();
  }

  if (orderBy !== validOrderBy) {
    console.warn(
      `[getArticleList] 지원하지 않는 orderBy="${orderBy}", "${validOrderBy}"로 대체됨.`
    );
  }

  return params;
}

// ===== Article API 함수들 =====

// GET /articles - 목록 조회
export function getArticleList(options = {}) {
  const params = buildQueryParams(options);

  return http
    .get("/articles", { params })
    .then((res) => {
      console.log(`[getArticleList] ${res.data.list?.length || 0}개 조회 성공`);
      return res.data;
    })
    .catch((err) => {
      // 인터셉터에서 이미 로깅했으므로 간단히 처리
      throw err;
    });
}

// GET /articles/:id - 단일 조회
export function getArticle(id) {
  if (!id) {
    return Promise.reject(new Error("Article ID가 필요합니다."));
  }

  return http.get(`/articles/${id}`).then((res) => {
    console.log(`[getArticle] ID ${id} 조회 성공`);
    return res.data;
  });
}

// POST /articles - 생성
export function createArticle({ title, content, image }) {
  // 필수 필드 검증
  if (!title || !content) {
    return Promise.reject(new Error("제목과 내용은 필수입니다."));
  }

  const payload = {
    title: title.trim(),
    content: content.trim(),
  };

  if (image) {
    payload.image = image;
  }

  return http.post("/articles", payload).then((res) => {
    console.log(`[createArticle] 새 Article 생성 완료 (ID: ${res.data.id})`);
    return res.data;
  });
}

// PATCH /articles/:id - 수정
export function patchArticle(id, partial) {
  if (!id) {
    return Promise.reject(new Error("Article ID가 필요합니다."));
  }

  if (!partial || Object.keys(partial).length === 0) {
    return Promise.reject(new Error("수정할 내용이 없습니다."));
  }

  // 빈 문자열 필드 제거
  const cleanedPartial = Object.entries(partial).reduce((acc, [key, value]) => {
    if (value !== undefined && value !== "") {
      acc[key] = typeof value === "string" ? value.trim() : value;
    }
    return acc;
  }, {});

  return http.patch(`/articles/${id}`, cleanedPartial).then((res) => {
    console.log(`[patchArticle] ID ${id} 수정 완료`);
    return res.data;
  });
}

// DELETE /articles/:id - 삭제
export function deleteArticle(id) {
  if (!id) {
    return Promise.reject(new Error("Article ID가 필요합니다."));
  }

  return http.delete(`/articles/${id}`).then((res) => {
    console.log(`[deleteArticle] ID ${id} 삭제 완료`);
    return res.data;
  });
}
