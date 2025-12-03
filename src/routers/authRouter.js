// src/routers/authRouter.js
const { Router } = require('express');
const { 
    signup, login, refreshToken, 
    getUserProfile, updateUserProfile, changePassword, 
    getUserProducts, getLikedProducts 
} = require('../controllers/authController');
const { authenticateUser } = require('../lib/auth/middleware');
const { uploadImage } = require('../src/middlewares/index'); // Multer 설정을 가져옵니다.
const { validateSignup, validatePasswordChange } = require('../structs/commonStructs');

const router = Router();

// ------------------------------------------------------------------
// 1. Auth Routes (/api/auth/*)
// ------------------------------------------------------------------
// 이 라우트들은 토큰 발급/갱신을 목적으로 하므로 인증 미들웨어가 필요하지 않습니다.

router.post('/auth/signup', validateSignup, signup);
router.post('/auth/login', login);
router.post('/auth/refresh', refreshToken); // Refresh Token으로 Access Token 갱신

// ------------------------------------------------------------------
// 2. User Profile Routes (/api/users/*)
// ------------------------------------------------------------------
// 모든 유저 정보 관리 API는 로그인(Access Token)이 필수입니다.
// authenticateUser 미들웨어가 토큰을 검증하고 req.userId를 설정합니다.

router.route('/users/me')
    // [GET] /api/users/me: 자신의 정보 조회
    .get(authenticateUser, getUserProfile) 
    // [PATCH] /api/users/me: 자신의 정보 수정 (닉네임, 이미지)
    // 이미지 파일 처리 후 업데이트 로직 실행
    .patch(authenticateUser, uploadImage, updateUserProfile);

// [PATCH] /api/users/me/password: 비밀번호 변경
router.patch('/users/me/password', authenticateUser, validatePasswordChange, changePassword);

// [GET] /api/users/me/products: 자신이 등록한 상품 목록 조회
router.get('/users/me/products', authenticateUser, getUserProducts);

// [GET] /api/users/me/likes/products: 자신이 '좋아요' 표시한 상품 목록 조회
router.get('/users/me/likes/products', authenticateUser, getLikedProducts);


module.exports = router;