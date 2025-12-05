"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const NotFoundError_1 = __importDefault(require("../lib/errors/NotFoundError"));
const token_1 = require("../lib/token");
const cookie_1 = require("../lib/cookie");
const constants_1 = require("../lib/constants");
const ValidationError_1 = __importDefault(require("../lib/errors/ValidationError"));
const ConflictError_1 = __importDefault(require("../lib/errors/ConflictError"));
class AuthController {
    //회원가입
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //이메일, 닉네임, 비밀번호 받기
            const { email, nickname, password } = req.body;
            //입력값 검증
            if (!email) {
                throw new ValidationError_1.default('이메일은 필수입니다.');
            }
            if (!password) {
                throw new ValidationError_1.default('비밀번호는 필수입니다.');
            }
            if (!nickname) {
                throw new ValidationError_1.default('닉네임은 필수입니다.');
            }
            //중복값 검증
            const check = yield prisma_1.default.user.findFirst({
                where: { nickname },
            });
            if (check) {
                throw new ConflictError_1.default('이미 존재하는 닉네임입니다.');
            }
            //비밀번호 해싱 과정
            const salt = yield bcrypt_1.default.genSalt(10);
            const hashedPassword = yield bcrypt_1.default.hash(password, salt);
            //회원 생성
            const user = yield prisma_1.default.user.create({
                data: { email, nickname, password: hashedPassword },
            });
            //비밀번호 제외 출력
            const { password: _ } = user, userWithoutPassword = __rest(user, ["password"]);
            res.status(201).send(userWithoutPassword);
        });
    }
    //로그인
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { nickname, password } = req.body;
            //닉네임 확인
            const user = yield prisma_1.default.user.findFirst({ where: { nickname } });
            if (!user) {
                throw new NotFoundError_1.default('닉네임을 찾을 수 없습니다.');
            }
            //비밀번호 확인
            const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
            if (!isPasswordValid) {
                throw new ValidationError_1.default('비밀번호가 일치하지 않습니다.');
            }
            //토큰 생성
            const { accessToken, refreshToken } = (0, token_1.generateTokens)(user.id);
            (0, cookie_1.setTokenCookies)(res, accessToken, refreshToken);
            res.status(200).send();
        });
    }
    //토큰 재발급
    refreshTokens(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const refreshToken = req.cookies[constants_1.REFRESH_TOKEN_COOKIE_NAME];
            // 토큰 확인
            if (!refreshToken) {
                throw new NotFoundError_1.default('토큰이 존재하지 않습니다.');
            }
            //토큰 유효성 검사, 유저 아이디 추출
            const { userId } = (0, token_1.verifyRefreshToken)(refreshToken);
            //유저 확인
            const user = yield prisma_1.default.user.findUnique({ where: { id: userId } });
            if (!user) {
                throw new NotFoundError_1.default('유저가 존재하지 않습니다.');
            }
            const { accessToken, refreshToken: newRefreshToken } = (0, token_1.generateTokens)(user.id);
            (0, cookie_1.setTokenCookies)(res, accessToken, newRefreshToken);
            res.status(200).send();
        });
    }
    logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, cookie_1.clearTokenCookies)(res);
            res.status(200).send();
        });
    }
}
exports.default = new AuthController();
