// src/lib/auth/utils.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * 비밀번호를 해싱합니다.
 * @param {string} password - 해싱할 평문 비밀번호
 * @returns {Promise<string>} 해싱된 비밀번호
 */
const hashPassword = (password) => {
    const salt = bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};

/**
 * 평문 비밀번호와 해시를 비교합니다.
 * @param {string} password - 평문 비밀번호
 * @param {string} hash - DB에 저장된 해시 비밀번호
 * @returns {Promise<boolean>} 일치 여부
 */
const comparePassword = (password, hash) => {
    return bcrypt.compare(password, hash);
};

/**
 * Access Token을 생성합니다. (단기 만료)
 * @param {{userId: number, nickname: string}} payload - 토큰에 포함할 사용자 데이터
 * @returns {string} 생성된 Access Token
 */
const generateAccessToken = (payload) => {
    const secret = process.env.ACCESS_TOKEN_SECRET;
    const expiresIn = process.env.ACCESS_TOKEN_EXPIRY || '1h'; // .env 미설정 시 기본 1시간
    return jwt.sign(payload, secret, { expiresIn });
};

/**
 * Refresh Token을 생성합니다. (장기 만료)
 * @param {{userId: number, nickname: string}} payload - 토큰에 포함할 사용자 데이터
 * @returns {string} 생성된 Refresh Token
 */
const generateRefreshToken = (payload) => {
    const secret = process.env.REFRESH_TOKEN_SECRET;
    const expiresIn = process.env.REFRESH_TOKEN_EXPIRY || '7d'; // .env 미설정 시 기본 7일
    return jwt.sign(payload, secret, { expiresIn });
};

/**
 * JWT 토큰을 검증하고 페이로드를 반환합니다.
 * @param {string} token - 검증할 JWT
 * @param {string} secret - 검증에 사용할 비밀 키
 * @returns {{userId: number, nickname: string} | null} 페이로드 또는 검증 실패 시 null
 */
const verifyToken = (token, secret) => {
    try {
        return jwt.verify(token, secret);
    } catch (e) {
        // 토큰이 만료되었거나 (TokenExpiredError) 유효하지 않은 경우 (JsonWebTokenError) null 반환
        return null;
    }
};

module.exports = {
    hashPassword,
    comparePassword,
    generateAccessToken,
    generateRefreshToken,
    verifyToken,
};