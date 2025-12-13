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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authRepository_1 = __importDefault(require("../repository/authRepository"));
const NotFoundError_1 = __importDefault(require("../lib/errors/NotFoundError"));
const ConflictError_1 = __importDefault(require("../lib/errors/ConflictError"));
const ValidationError_1 = __importDefault(require("../lib/errors/ValidationError"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const token_1 = require("../lib/token");
class AuthService {
    //회원가입
    register(email, nickname, password) {
        return __awaiter(this, void 0, void 0, function* () {
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
            const existingUser = yield authRepository_1.default.findByNickname(nickname);
            if (existingUser) {
                throw new ConflictError_1.default('이미 존재하는 닉네임입니다.');
            }
            //비밀번호 해싱 과정
            const salt = yield bcrypt_1.default.genSalt(10);
            const hashedPassword = yield bcrypt_1.default.hash(password, salt);
            //회원 생성
            const user = yield authRepository_1.default.createUser(email, nickname, hashedPassword);
            return user;
        });
    }
    //로그인
    login(nickname, password) {
        return __awaiter(this, void 0, void 0, function* () {
            //닉네임 확인
            const user = yield authRepository_1.default.findByNickname(nickname);
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
            return { accessToken, refreshToken };
        });
    }
    refreshTokens(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            //유저 존재 확인
            const user = yield authRepository_1.default.findById(userId);
            if (!user) {
                throw new NotFoundError_1.default('유저를 찾을 수 없습니다.');
            }
            //토큰 생성
            const { accessToken, refreshToken: newRefreshToken } = (0, token_1.generateTokens)(user.id);
            return { accessToken, newRefreshToken };
        });
    }
}
exports.default = new AuthService();
