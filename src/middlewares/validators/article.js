/**
 * 게시글 관련 유효성 검사 미들웨어
 * - express-validator를 사용하여 입력 필드를 검증합니다.
 */
import { body, validationResult } from 'express-validator';
import { ApiError } from '../../utils/apiError.js';
import { BAD_REQUEST } from '../../constants/status.js';

/**
 * 유효성 검사 결과를 처리하는 미들웨어
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }

    // 에러 메시지를 배열로 추출하여 Bad Request (400) 에러 발생
    const extractedErrors = errors.array().map(err => err.msg);
    const errorMessage = extractedErrors.join(' | ');

    return next(new ApiError(BAD_REQUEST, `유효성 검사 실패: ${errorMessage}`));
};

/**
 * [POST /articles] 게시글 등록 유효성 검사
 */
export const validateCreateArticle = [
    body('title')
        .trim()
        .exists({ checkFalsy: true })
        .withMessage('게시글 제목을 입력해야 합니다.')
        .isLength({ min: 5, max: 200 })
        .withMessage('게시글 제목은 5자 이상 200자 이하로 입력해야 합니다.'),

    body('content')
        .trim()
        .exists({ checkFalsy: true })
        .withMessage('게시글 내용을 입력해야 합니다.')
        .isLength({ min: 10, max: 5000 })
        .withMessage('게시글 내용은 10자 이상 5000자 이하로 입력해야 합니다.'),

    validate, // 유효성 검사 결과를 처리
];

/**
 * [PATCH /articles/:id] 게시글 수정 유효성 검사
 * - PATCH 요청이므로 모든 필드는 선택 사항(optional)입니다.
 * - 입력된 필드에 대해서만 유효성을 검사합니다.
 */
export const validateUpdateArticle = [
    body('title')
        .optional()
        .trim()
        .isLength({ min: 5, max: 200 })
        .withMessage('게시글 제목은 5자 이상 200자 이하로 입력해야 합니다.'),

    body('content')
        .optional()
        .trim()
        .isLength({ min: 10, max: 5000 })
        .withMessage('게시글 내용은 10자 이상 5000자 이하로 입력해야 합니다.'),

    validate, // 유효성 검사 결과를 처리
];
