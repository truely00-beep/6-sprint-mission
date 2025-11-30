// src/controllers/authController.js
const prisma = require('../lib/prismaClient');
const withAsync = require('../lib/withAsync');
const { hashPassword, comparePassword, generateAccessToken, generateRefreshToken, verifyToken } = require('../lib/auth/utils');
const { HTTP_STATUS_CREATED, HTTP_STATUS_OK, HTTP_STATUS_CONFLICT, HTTP_STATUS_UNAUTHORIZED, HTTP_STATUS_FORBIDDEN } = require('../lib/constants');
const NotFoundError = require('../lib/errors/NotFoundError');
const BadRequestError = require('../lib/errors/BadRequestError');

// --- Auth Operations ---

/**
 * [POST] /api/auth/signup
 * 회원가입: 이메일, 닉네임, 비밀번호를 받아 유저를 생성하고 비밀번호를 해싱 저장합니다.
 */
const signup = withAsync(async (req, res) => {
    const { email, nickname, password } = req.body;

    const existingUser = await prisma.user.findFirst({
        where: { OR: [{ email }, { nickname }] },
    });

    if (existingUser) {
        return res.status(HTTP_STATUS_CONFLICT).json({ 
            status: 'error', 
            message: "이미 존재하는 이메일 또는 닉네임입니다." 
        });
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await prisma.user.create({
        data: { email, nickname, password: hashedPassword },
    });

    // 응답 시 비밀번호와 Refresh Token은 제외
    const { password: _, refreshToken: __, ...userData } = newUser;

    res.status(HTTP_STATUS_CREATED).json({
        status: 'success',
        message: '회원가입에 성공했습니다.',
        data: userData,
    });
});

/**
 * [POST] /api/auth/login
 * 로그인: Access Token 및 Refresh Token을 발급하고 Refresh Token은 DB에 저장합니다.
 */
const login = withAsync(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new BadRequestError("이메일과 비밀번호를 모두 입력해야 합니다.");
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await comparePassword(password, user.password))) {
        return res.status(HTTP_STATUS_UNAUTHORIZED).json({
            status: 'error',
            message: "이메일 또는 비밀번호가 올바르지 않습니다."
        });
    }

    const payload = { userId: user.id, nickname: user.nickname };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Refresh Token을 DB에 저장하여 토큰 탈취 방지 및 유효성 검증에 사용
    await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken },
    });

    res.status(HTTP_STATUS_OK).json({
        status: 'success',
        message: '로그인 성공',
        data: { accessToken, refreshToken, userId: user.id, nickname: user.nickname },
    });
});

/**
 * [POST] /api/auth/refresh
 * 토큰 갱신: Refresh Token을 검증하고 새로운 Access Token을 발급합니다.
 */
const refreshAccessToken = withAsync(async (req, res) => {
    const token = req.body.refreshToken;
    if (!token) {
        throw new BadRequestError("Refresh Token이 필요합니다.");
    }

    const secret = process.env.REFRESH_TOKEN_SECRET;
    const payload = verifyToken(token, secret);

    if (!payload) {
        return res.status(HTTP_STATUS_FORBIDDEN).json({
            status: 'error',
            message: "유효하지 않거나 만료된 Refresh Token입니다. 재로그인하세요."
        });
    }

    const user = await prisma.user.findUnique({ where: { id: payload.userId } });

    // DB에 저장된 토큰과 일치하는지 확인
    if (!user || user.refreshToken !== token) {
        return res.status(HTTP_STATUS_FORBIDDEN).json({
            status: 'error',
            message: "유효하지 않은 Refresh Token입니다."
        });
    }

    const newPayload = { userId: user.id, nickname: user.nickname };
    const newAccessToken = generateAccessToken(newPayload);

    res.status(HTTP_STATUS_OK).json({
        status: 'success',
        message: 'Access Token이 갱신되었습니다.',
        data: { accessToken: newAccessToken }
    });
});

// --- User Profile Operations ---

/**
 * [GET] /api/users/me
 * 자신의 유저 정보 조회 (비밀번호 제외)
 */
const getUserProfile = withAsync(async (req, res) => {
    const userId = req.userId; // authenticateUser 미들웨어에서 설정됨
    
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, email: true, nickname: true, image: true, createdAt: true, updatedAt: true },
    });

    if (!user) {
        throw new NotFoundError("사용자 정보를 찾을 수 없습니다.");
    }

    res.status(HTTP_STATUS_OK).json({ status: 'success', data: user });
});

/**
 * [PATCH] /api/users/me
 * 유저 정보 수정 (닉네임, 이미지)
 */
const updateUserProfile = withAsync(async (req, res) => {
    const userId = req.userId;
    const { nickname } = req.body;
    // req.file은 imagesRouter에서 정의된 Multer 미들웨어를 통해 설정됨
    const imagePath = req.file ? `/public/uploads/${req.file.filename}` : undefined; 

    const updateData = {};
    if (nickname) updateData.nickname = nickname;
    if (imagePath) updateData.image = imagePath;

    if (Object.keys(updateData).length === 0) {
        throw new BadRequestError("수정할 정보가 없습니다.");
    }

    try {
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updateData,
            select: { id: true, email: true, nickname: true, image: true, updatedAt: true }
        });

        res.status(HTTP_STATUS_OK).json({
            status: 'success',
            message: '사용자 정보가 성공적으로 수정되었습니다.',
            data: updatedUser
        });
    } catch (error) {
        if (error.code === 'P2002') { // Nickname conflict
            return res.status(HTTP_STATUS_CONFLICT).json({ 
                status: 'error', 
                message: "이미 사용 중인 닉네임입니다." 
            });
        }
        throw error;
    }
});

/**
 * [PATCH] /api/users/me/password
 * 유저 비밀번호 변경
 */
const changePassword = withAsync(async (req, res) => {
    const userId = req.userId;
    const { currentPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundError("사용자 정보를 찾을 수 없습니다.");

    // 현재 비밀번호 확인
    if (!(await comparePassword(currentPassword, user.password))) {
        return res.status(HTTP_STATUS_UNAUTHORIZED).json({
            status: 'error',
            message: "현재 비밀번호가 올바르지 않습니다."
        });
    }

    const hashedNewPassword = await hashPassword(newPassword);

    await prisma.user.update({
        where: { id: userId },
        data: { password: hashedNewPassword }
    });

    res.status(HTTP_STATUS_OK).json({
        status: 'success',
        message: '비밀번호가 성공적으로 변경되었습니다.'
    });
});

/**
 * [GET] /api/users/me/products
 * 유저가 등록한 상품 목록 조회
 */
const getUserProducts = withAsync(async (req, res) => {
    const userId = req.userId;
    const products = await prisma.product.findMany({
        where: { userId },
        select: { id: true, name: true, price: true, createdAt: true, imagePath: true },
        orderBy: { createdAt: 'desc' }
    });

    res.status(HTTP_STATUS_OK).json({ status: 'success', data: products });
});

/**
 * [GET] /api/users/me/likes/products
 * 유저가 '좋아요' 표시한 상품 목록 조회
 */
const getLikedProducts = withAsync(async (req, res) => {
    const userId = req.userId;
    const likes = await prisma.like.findMany({
        where: { userId, productId: { not: null } },
        select: {
            product: {
                select: { id: true, name: true, price: true, createdAt: true, imagePath: true }
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    // Null 값 제거 및 상품 목록 추출
    const likedProducts = likes.map(like => like.product).filter(p => p !== null);

    res.status(HTTP_STATUS_OK).json({ status: 'success', data: likedProducts });
});


module.exports = {
    signup,
    login,
    refreshToken: refreshAccessToken,
    getUserProfile,
    updateUserProfile,
    changePassword,
    getUserProducts,
    getLikedProducts,
};