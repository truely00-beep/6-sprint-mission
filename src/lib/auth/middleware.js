// src/lib/auth/middleware.js
const prisma = require('../prismaClient');
const { verifyToken } = require('./utils');
const { HTTP_STATUS_UNAUTHORIZED, HTTP_STATUS_FORBIDDEN } = require('../constants');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');

/**
 * 1. 토큰 기반 인증 미들웨어 (Access Token 검증)
 * 로그인 사용자만 접근 가능한 라우트에 사용됩니다.
 * @returns 401 Unauthorized if token is missing or invalid
 */
const authenticateUser = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(HTTP_STATUS_UNAUTHORIZED).json({
            status: 'error',
            message: "인증 토큰이 누락되었거나 형식이 잘못되었습니다."
        });
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.ACCESS_TOKEN_SECRET;
    const payload = verifyToken(token, secret);

    if (!payload) {
        return res.status(HTTP_STATUS_UNAUTHORIZED).json({
            status: 'error',
            message: "유효하지 않거나 만료된 Access Token입니다."
        });
    }

    req.userId = payload.userId; // 요청 객체에 userId를 저장하여 컨트롤러에서 사용
    next();
};

/**
 * 2. 자원 소유권 인가 미들웨어
 * 상품, 게시글, 댓글의 수정/삭제 시 해당 자원의 소유자인지 확인합니다.
 * @param {string} modelName - 'user', 'product', 'article', 'comment' 등 Prisma 모델 이름
 */
const authorizeOwner = (modelName) => async (req, res, next) => {
    const resourceId = parseInt(req.params.id);
    const userId = req.userId; // authenticateUser 미들웨어에서 설정된 userId

    if (!userId) {
        // 이미 authenticateUser를 거쳤으므로, 이 상황은 사실상 401 Unauthorized
        return res.status(HTTP_STATUS_UNAUTHORIZED).json({
             status: 'error',
             message: "인증된 사용자 정보가 없습니다."
        });
    }
    if (isNaN(resourceId)) {
        return next(new BadRequestError("유효하지 않은 자원 ID입니다."));
    }

    try {
        // Prisma에서 해당 모델의 userId를 조회
        const resource = await prisma[modelName].findUnique({
            where: { id: resourceId },
            select: { userId: true },
        });

        if (!resource) {
            return next(new NotFoundError("해당 리소스를 찾을 수 없습니다."));
        }

        if (resource.userId !== userId) {
            return res.status(HTTP_STATUS_FORBIDDEN).json({
                status: 'error',
                message: "해당 리소스에 대한 수정/삭제 권한이 없습니다."
            });
        }

        next();
    } catch (error) {
        next(error);
    }
};

/**
 * 3. 선택적 인증 미들웨어 (Optional Authentication)
 * 목록 조회나 상세 조회처럼 인증이 필수는 아니지만, 토큰이 있다면 userId를 추출합니다.
 * (예: isLiked 필드 표시 용도)
 */
const optionalAuthenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    req.userId = null; // 기본값은 null

    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        const secret = process.env.ACCESS_TOKEN_SECRET;
        const payload = verifyToken(token, secret);

        if (payload) {
            req.userId = payload.userId; // 유효하면 userId를 설정
        }
    }
    next();
};

module.exports = {
    authenticateUser,
    authorizeOwner,
    optionalAuthenticate,
};