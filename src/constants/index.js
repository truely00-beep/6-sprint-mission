/**
 * API에서 사용되는 상수를 정의합니다.
 */

// --- Pagination Constants (페이지네이션 상수) ---
export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;
export const MAX_LIMIT = 100;

// --- Sorting Constants (정렬 상수) ---
export const SORT_RECENT = 'recent';
export const SORT_DESC = 'desc'; // Prisma 정렬 순서

// --- Upload Constants (업로드 상수) ---
export const UPLOAD_BASE_PATH = '/uploads';
export const MAX_FILE_SIZE_MB = 5;
