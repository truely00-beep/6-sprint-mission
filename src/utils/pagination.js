// src/utils/pagination.js

/**
 * offset 기반 페이지네이션 파라미터 생성 (목록)
 * @param {string|number} offset
 * @param {string|number} limit
 * @returns {{skip: number, take: number}}
 */
exports.offsetPagination = (offset = 0, limit = 10) => {
    return {
        skip: Number(offset) < 0 ? 0 : Number(offset),
        take: Number(limit) > 0 ? Number(limit) : 10
    };
};

/**
 * cursor 기반 페이지네이션 파라미터 생성 (댓글)
 * @param {string|number} cursor
 * @param {string|number} limit
 * @returns {{cursor: number, take: number}}
 */
exports.cursorPagination = (cursor = 0, limit = 10) => {
    return {
        cursor: Number(cursor) < 0 ? 0 : Number(cursor),
        take: Number(limit) > 0 ? Number(limit) : 10
    };
};

/**
 * 페이징 응답 포맷터: 다음 cursor/offset 등 전달
 * @param {Array} items - 조회된 결과 리스트
 * @param {number} next - 다음 cursor|offset 값
 * @returns {{items: Array, next: number}}
 */
exports.formatPagingResponse = (items, next) => ({
    items,
    next
});
