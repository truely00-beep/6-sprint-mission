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
exports.authenticate = authenticate;
const prisma_1 = __importDefault(require("../lib/prisma"));
const token_1 = require("../lib/token");
const constants_1 = require("../lib/constants");
const UnauthorizedError_1 = __importDefault(require("../lib/errors/UnauthorizedError"));
function authenticate(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const accessToken = req.cookies[constants_1.ACCESS_TOKEN_COOKIE_NAME];
            if (!accessToken) {
                throw new UnauthorizedError_1.default('로그인이 필요합니다.');
            }
            const { userId } = (0, token_1.verifyAccessToken)(accessToken);
            const user = yield prisma_1.default.user.findUnique({ where: { id: userId } });
            if (!user) {
                throw new UnauthorizedError_1.default('유효하지 않은 토큰입니다.');
            }
            req.user = user;
            return next();
        }
        catch (err) {
            return next(err);
        }
    });
}
