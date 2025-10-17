// ProductService.js
const PRODUCT_API_BASE_URL =
  "https://panda-market-api-crud.vercel.app/products";

/**
 * 응답 상태 코드가 2XX가 아닐 경우 에러 메시지를 던지는 헬퍼 함수
 * @param {Response} response fetch 응답 객체
 * @throws {Error} 상태 코드가 2XX가 아닐 경우
 */
async function handleResponse(response) {
  if (!response.ok) {
    const errorText = await response.text();
    console.error(
      `[Error] API 요청 실패: ${response.status} ${response.statusText}`,
    );
    throw new Error(
      `API 요청 실패: ${response.status} ${response.statusText} - ${errorText}`,
    );
  }
  return response.json();
}

/**
 * 상품 목록을 조회합니다.
 * @param {object} params 쿼리 파라미터 객체
 * @param {number} [params.page=1] 페이지 번호
 * @param {number} [params.pageSize=10] 페이지 당 상품 수
 * @param {string} [params.keyword] 검색 키워드
 * @returns {Promise<object>} 상품 목록 데이터
 */
export async function getProductList(params = {}) {
  const url = new URL(PRODUCT_API_BASE_URL);
  Object.keys(params).forEach((key) => {
    if (params[key] !== undefined) url.searchParams.append(key, params[key]);
  });

  try {
    const response = await fetch(url);
    return await handleResponse(response);
  } catch (error) {
    console.error(`getProductList 오류:`, error.message);
    throw error;
  }
}

/**
 * 특정 상품을 조회합니다.
 * @param {string} id 상품 ID
 * @returns {Promise<object>} 상품 데이터
 */
export async function getProduct(id) {
  try {
    const response = await fetch(`${PRODUCT_API_BASE_URL}/${id}`);
    return await handleResponse(response);
  } catch (error) {
    console.error(`getProduct 오류 (ID: ${id}):`, error.message);
    throw error;
  }
}

/**
 * 새로운 상품을 생성합니다.
 * @param {object} productData 생성할 상품 데이터 (name, description, price, tags, images)
 * @returns {Promise<object>} 생성된 상품 데이터
 */
export async function createProduct(productData) {
  try {
    const response = await fetch(PRODUCT_API_BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("createProduct 오류:", error.message);
    throw error;
  }
}

/**
 * 상품 정보를 부분 수정합니다.
 * @param {string} id 상품 ID
 * @param {object} patchData 수정할 데이터
 * @returns {Promise<object>} 수정된 상품 데이터
 */
export async function patchProduct(id, patchData) {
  try {
    const response = await fetch(`${PRODUCT_API_BASE_URL}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patchData),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error(`patchProduct 오류 (ID: ${id}):`, error.message);
    throw error;
  }
}

/**
 * 상품을 삭제합니다.
 * @param {string} id 상품 ID
 * @returns {Promise<void>}
 */
export async function deleteProduct(id) {
  try {
    const response = await fetch(`${PRODUCT_API_BASE_URL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      // DELETE는 보통 body가 없으므로 text() 대신 상태만 확인
      console.error(
        `[Error] API 요청 실패: ${response.status} ${response.statusText}`,
      );
      throw new Error(
        `API 요청 실패: ${response.status} ${response.statusText}`,
      );
    }
    console.log(`Product ID ${id} 삭제 성공.`);
  } catch (error) {
    console.error(`deleteProduct 오류 (ID: ${id}):`, error.message);
    throw error;
  }
}
