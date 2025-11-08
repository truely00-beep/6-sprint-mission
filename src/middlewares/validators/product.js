/**
 * 상품 관련 유효성 검사 미들웨어
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
 * [POST /products] 상품 등록 유효성 검사
 */
export const validateCreateProduct = [
    body('name')
        .trim()
        .exists({ checkFalsy: true })
        .withMessage('상품 이름을 입력해야 합니다.')
        .isLength({ min: 2, max: 100 })
        .withMessage('상품 이름은 2자 이상 100자 이하로 입력해야 합니다.'),

    body('description')
        .trim()
        .exists({ checkFalsy: true })
        .withMessage('상품 설명을 입력해야 합니다.')
        .isLength({ min: 10, max: 2000 })
        .withMessage('상품 설명은 10자 이상 2000자 이하로 입력해야 합니다.'),

    body('price')
        .exists({ checkFalsy: true })
        .withMessage('상품 가격을 입력해야 합니다.')
        .isInt({ gt: 0 })
        .withMessage('상품 가격은 0보다 큰 정수여야 합니다.'),

    body('tags')
        .optional()
        .isArray()
        .withMessage('태그는 배열 형식이어야 합니다.')
        .custom(value => value.every(tag => typeof tag === 'string' && tag.trim().length > 0))
        .withMessage('태그 배열의 모든 요소는 비어있지 않은 문자열이어야 합니다.'),

    validate, // 유효성 검사 결과를 처리
];

/**
 * [PATCH /products/:id] 상품 수정 유효성 검사
 * - PATCH 요청이므로 모든 필드는 선택 사항(optional)입니다.
 * - 입력된 필드에 대해서만 유효성을 검사합니다.
 */
export const validateUpdateProduct = [
    body('name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('상품 이름은 2자 이상 100자 이하로 입력해야 합니다.'),

    body('description')
        .optional()
        .trim()
        .isLength({ min: 10, max: 2000 })
        .withMessage('상품 설명은 10자 이상 2000자 이하로 입력해야 합니다.'),

    body('price')
        .optional()
        .isInt({ gt: 0 })
        .withMessage('상품 가격은 0보다 큰 정수여야 합니다.'),

    body('tags')
        .optional()
        .isArray()
        .withMessage('태그는 배열 형식이어야 합니다.')
        .custom(value => value.every(tag => typeof tag === 'string' && tag.trim().length > 0))
        .withMessage('태그 배열의 모든 요소는 비어있지 않은 문자열이어야 합니다.'),

    validate, // 유효성 검사 결과를 처리
];
