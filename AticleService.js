// ArticleService.js

const BASE_URL = "https://panda-market-api-crud.vercel.app/article";

/**
 * 공통 응답 처리: 2XX 상태가 아닐 경우 에러를 throw 합니다.
 */
const handleResponse = (response) => {
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
 * [GET] 아티클 목록을 조회합니다.
 */
export const getArticleList = (params = {}) => {
    const url = new URL(BASE_URL);
    Object.keys(params).forEach((key) => {
        if (params[key] !== undefined && params[key] !== null) {
            url.searchParams.append(key, params[key]);
        }
    });
    return fetch(url.toString(), { method: "GET" })
        .then(handleResponse)
        .then((data) => data.data) // 실제 아티클 배열만 반환
        .catch((error) => {
            console.error(`getArticleList 오류:`, error.message);
            throw error;
        });
};

/**
 * [GET] 특정 아티클을 조회합니다.
 */
export const getArticle = (id) => {
    return fetch(`${BASE_URL}/${id}`, { method: "GET" })
        .then(handleResponse)
        .then((data) => data.data)
        .catch((error) => {
            console.error(`getArticle (ID: ${id}) 오류:`, error.message);
            throw error;
        });
};

/**
 * [POST] 새로운 아티클을 생성합니다.
 */
export const createArticle = (articleData) => {
    return fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(articleData),
    })
        .then(handleResponse)
        .then((data) => data.data)
        .catch((error) => {
            console.error("createArticle 오류:", error.message);
            throw error;
        });
};

/**
 * [PATCH] 특정 아티클을 수정합니다.
 */
export const patchArticle = (id, updateData) => {
    return fetch(`${BASE_URL}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
    })
        .then(handleResponse)
        .then((data) => data.data)
        .catch((error) => {
            console.error(`patchArticle (ID: ${id}) 오류:`, error.message);
            throw error;
        });
};

/**
 * [DELETE] 특정 아티클을 삭제합니다.
 */
export const deleteArticle = (id) => {
    return fetch(`${BASE_URL}/${id}`, { method: "DELETE" })
        .then(handleResponse)
        .then((data) => data.data)
        .catch((error) => {
            console.error(`deleteArticle (ID: ${id}) 오류:`, error.message);
            throw error;
        });
};