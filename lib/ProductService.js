// ProductService.js
import axios from "axios";

// axios 인스턴스 생성
const http = axios.create({
  baseURL: "https://panda-market-api-crud.vercel.app",
  timeout: 10000, // 10초 타임아웃
  headers: {
    "Content-Type": "application/json",
  },
});

// 응답 인터셉터로 공통 에러 처리
http.interceptors.response.use(
  (response) => response,
  async (error) => {
    // 네트워크 오류
    if (!error.response) {
      console.error("[Product API] 네트워크 오류:", error.message);
      throw new Error("네트워크 연결을 확인해주세요.");
    }

    // HTTP 에러
    const { status, statusText, data } = error.response;
    console.error(`[Product API Error] ${status} ${statusText}`);
    if (data) console.error("상세 에러:", data);

    // 에러 객체 개선
    const enhancedError = new Error(`API 요청 실패: ${status} ${statusText}`);
    enhancedError.status = status;
    enhancedError.data = data;
    throw enhancedError;
  }
);

// 쿼리 파라미터 검증 헬퍼
const PRODUCT_ORDER_BY = new Set(["recent", "favorite"]);

function buildQueryParams({
  page = 1,
  pageSize = 10,
  keyword = "",
  orderBy = "recent",
} = {}) {
  // 파라미터 유효성 검증
  const validPage = Math.max(1, parseInt(page) || 1);
  const validPageSize = Math.min(100, Math.max(1, parseInt(pageSize) || 10));
  const validOrderBy = PRODUCT_ORDER_BY.has(orderBy) ? orderBy : "recent";

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
      `[getProductList] 지원하지 않는 orderBy="${orderBy}", "${validOrderBy}"로 대체됨.`
    );
  }

  return params;
}

// 가격 유효성 검증 헬퍼
function validatePrice(price) {
  const numPrice = Number(price);
  if (isNaN(numPrice) || numPrice < 0) {
    throw new Error("가격은 0 이상의 숫자여야 합니다.");
  }
  return numPrice;
}

// ===== Product API 함수들 (async/await) =====

// GET /products - 목록 조회
export async function getProductList(options = {}) {
  try {
    const params = buildQueryParams(options);
    const res = await http.get("/products", { params });

    console.log(`[getProductList] ${res.data.list?.length || 0}개 조회 성공`);
    return res.data;
  } catch (error) {
    // 인터셉터에서 이미 로깅했으므로 throw로 던지기
    throw error;
  }
}

// GET /products/:id - 단일 조회
export async function getProduct(id) {
  if (!id) {
    throw new Error("Product ID가 필요합니다.");
  }

  try {
    const res = await http.get(`/products/${id}`);
    console.log(`[getProduct] ID ${id} 조회 성공`);
    return res.data;
  } catch (error) {
    throw error;
  }
}

// POST /products - 생성
export async function createProduct({
  name,
  description,
  price,
  tags = [],
  images = [],
}) {
  // 필수 필드 검증
  if (!name || !description || price === undefined) {
    throw new Error("상품명, 설명, 가격은 필수입니다.");
  }

  try {
    const validPrice = validatePrice(price);

    const payload = {
      name: name.trim(),
      description: description.trim(),
      price: validPrice,
      tags: Array.isArray(tags) ? tags.filter((t) => t && t.trim()) : [],
      images: Array.isArray(images)
        ? images.filter((img) => img && img.trim())
        : [],
    };

    const res = await http.post("/products", payload);
    console.log(`[createProduct] 새 Product 생성 완료 (ID: ${res.data.id})`);
    return res.data;
  } catch (error) {
    throw error;
  }
}

// PATCH /products/:id - 수정
export async function patchProduct(id, partial) {
  if (!id) {
    throw new Error("Product ID가 필요합니다.");
  }

  if (!partial || Object.keys(partial).length === 0) {
    throw new Error("수정할 내용이 없습니다.");
  }

  try {
    // 가격이 있으면 검증
    const cleanedPartial = { ...partial };
    if ("price" in cleanedPartial) {
      cleanedPartial.price = validatePrice(cleanedPartial.price);
    }

    // 빈 문자열 필드 제거
    Object.keys(cleanedPartial).forEach((key) => {
      const value = cleanedPartial[key];
      if (typeof value === "string" && !value.trim()) {
        delete cleanedPartial[key];
      }
    });

    const res = await http.patch(`/products/${id}`, cleanedPartial);
    console.log(`[patchProduct] ID ${id} 수정 완료`);
    return res.data;
  } catch (error) {
    throw error;
  }
}

// DELETE /products/:id - 삭제
export async function deleteProduct(id) {
  if (!id) {
    throw new Error("Product ID가 필요합니다.");
  }

  try {
    const res = await http.delete(`/products/${id}`);
    console.log(`[deleteProduct] ID ${id} 삭제 완료`);
    return res.data;
  } catch (error) {
    throw error;
  }
}
