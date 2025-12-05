"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setTokenCookies = setTokenCookies;
exports.clearTokenCookies = clearTokenCookies;
const constants_1 = require("./constants");
function setTokenCookies(res, accessToken, refreshToken) {
    res.cookie(constants_1.ACCESS_TOKEN_COOKIE_NAME, accessToken, {
        httpOnly: true,
        secure: constants_1.NODE_ENV === 'production',
        maxAge: 1 * 60 * 60 * 1000,
    });
    res.cookie(constants_1.REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
        httpOnly: true,
        secure: constants_1.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/auth/refresh',
    });
}
function clearTokenCookies(res) {
    res.clearCookie(constants_1.ACCESS_TOKEN_COOKIE_NAME);
    res.clearCookie(constants_1.REFRESH_TOKEN_COOKIE_NAME);
}
