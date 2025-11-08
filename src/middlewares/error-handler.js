/**
 * 전역 에러 핸들러 미들웨어
 *
 * 이 미들웨어는 Express 애플리케이션에서 발생하는 모든 예외를 중앙에서 처리합니다.
 * - 커스텀 ApiError (4xx 상태 코드)
 * - Prisma Client 관련 오류 (예: P2025 리소스 찾을 수 없음)
 * - 기타 서버 오류 (500)
 */
import { ApiError } from '../utils/apiError.js';
import { NOT_FOUND, INTERNAL_SERVER_ERROR } from '../constants/status.js';

// Prisma 에러 코드 상수
const PRISMA_ERROR = {
    NOT_FOUND: 'P2025',
};

/**
 * 에러 핸들러 미들웨어
 * @param {Error | ApiError} error - 발생한 에러 객체
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const errorHandler = (error, req, res, next) => {
    // 1. 기본 상태 코드 및 메시지 설정
    let status = INTERNAL_SERVER_ERROR; // 기본값: 500
    let message = '서버 내부 오류가 발생했습니다.';

    // 2. Custom ApiError 처리
    if (error instanceof ApiError) {
        status = error.status;
        message = error.message;
    } 
    // 3. Prisma Client 오류 처리
    else if (error.code && error.code.startsWith('P')) {
        switch (error.code) {
            case PRISMA_ERROR.NOT_FOUND:
                status = NOT_FOUND;
                message = error.meta?.cause || error.meta?.modelName 
                          ? `${error.meta.modelName} 리소스를 찾을 수 없습니다.` 
                          : '요청한 리소스를 찾을 수 없습니다.';
                break;
            // 기타 Prisma 오류 (예: Unique Constraint Failed P2002 등)는 400 Bad Request로 처리 가능
            // 여기서는 P2025 (찾을 수 없음)에 집중합니다.
            default:
                // 다른 Prisma 오류는 500으로 처리하고, 상세 메시지는 로깅용으로 남깁니다.
                status = INTERNAL_SERVER_ERROR;
                message = '데이터베이스 처리 중 오류가 발생했습니다.';
                break;
        }
    }
    // 4. Multer 오류 처리 (파일 업로드 관련)
    else if (error.name === 'MulterError') {
        status = 400;
        message = `파일 업로드 오류: ${error.message}`;
    }
    // 5. 기타 일반 Error 객체 처리
    else {
        // 운영 환경에서는 민감할 수 있는 에러 메시지를 숨깁니다.
        if (process.env.NODE_ENV !== 'production' && error.message) {
             message = error.message;
        }
    }

    // 콘솔에 에러 상세 정보 출력 (디버깅용)
    console.error(`[${req.method}] ${req.path} | Error ${status}: ${message}`);
    if (process.env.NODE_ENV !== 'production') {
        console.error(error.stack);
    }
    
    // 최종 응답 전송
    return res.status(status).json({
        success: false,
        status: status,
        message: message,
    });
};

