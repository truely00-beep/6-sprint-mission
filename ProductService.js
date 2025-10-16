// ProductService.js

const BASE_URL = "https://panda-market-api-crud.vercel.app/product";

/**
 * 공통 응답 처리: 2XX 상태가 아닐 경우 에러를 throw 합니다.
 */
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = new Error(
      `HTTP error! Status: ${response.status} ${response.statusText}`
    );
    error.response = response;
    throw error;
  }
  return response.json();
};

/**
 * [GET] 상품 목록을 조회합니다. (async/await)
 */
export const getProductList = async (params = {}) => {
  try {
    const url = new URL(BASE_URL);
    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined && params[key] !== null) {
        url.searchParams.append(key, params[key]);
      }
    });

    const response = await fetch(url.toString(), { method: "GET" });
    const data = await handleResponse(response);
    return data.data;
  } catch (error) {
    console.error(`getProductList 오류:`, error.message);
    throw error;
  }
};

/**
 * [GET] 특정 상품을 조회합니다. (async/await)
 */
export const getProduct = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, { method: "GET" });
    const data = await handleResponse(response);
    return data.data;
  } catch (error) {
    console.error(`getProduct (ID: ${id}) 오류:`, error.message);
    throw error;
  }
};

/**
 * [POST] 새로운 상품을 생성합니다. (async/await)
 */
export const createProduct = async (productData) => {
  try {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
    });
    const data = await handleResponse(response);
    return data.data;
  } catch (error) {
    console.error("createProduct 오류:", error.message);
    throw error;
  }
};

/**
 * [PATCH] 특정 상품을 수정합니다. (async/await)
 */
export const patchProduct = async (id, updateData) => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateData),
    });
    const data = await handleResponse(response);
    return data.data;
  } catch (error) {
    console.error(`patchProduct (ID: ${id}) 오류:`, error.message);
    throw error;
  }
};

/**
 * [DELETE] 특정 상품을 삭제합니다. (async/await)
 */
export const deleteProduct = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
    const data = await handleResponse(response);
    return data.data;
  } catch (error) {
    console.error(`deleteProduct (ID: ${id}) 오류:`, error.message);
    throw error;
  }
};
