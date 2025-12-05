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
const superstruct_1 = require("superstruct");
const prisma_1 = __importDefault(require("../lib/prisma"));
const NotFoundError_1 = __importDefault(require("../lib/errors/NotFoundError"));
const ValidationError_1 = __importDefault(require("../lib/errors/ValidationError"));
const userStructs_1 = require("../structs/userStructs");
const ForbiddenError_1 = __importDefault(require("../lib/errors/ForbiddenError"));
const UnauthorizedError_1 = __importDefault(require("../lib/errors/UnauthorizedError"));
class UserController {
    //유저 자신의 정보 조희 GET
    getMe(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //로그인된 유저
            const loginUser = req.user;
            if (!loginUser) {
                throw new UnauthorizedError_1.default('해당 유저가 없습니다.');
            }
            const user = yield prisma_1.default.user.findUnique({
                where: { id: loginUser.id },
            });
            if (!user) {
                throw new NotFoundError_1.default('해당 닉네임을 찾을 수 없습니다.');
            }
            //비밀번호 제외 출력
            const { password: _ } = user, userWithoutPassword = __rest(user, ["password"]);
            res.status(200).send(userWithoutPassword);
        });
    }
    //유저 자신의 정보 수정 PATCH
    updateMe(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, superstruct_1.assert)(req.body, userStructs_1.patchUser);
            //로그인된 유저 확인
            const loginUser = req.user;
            if (!loginUser) {
                throw new UnauthorizedError_1.default('해당 유저가 없습니다.');
            }
            const user = yield prisma_1.default.user.update({
                where: { id: loginUser.id },
                data: req.body,
            });
            //비밀번호 제외 출력
            const { password: _ } = user, userWithoutPassword = __rest(user, ["password"]);
            res.status(200).send(userWithoutPassword);
        });
    }
    //유저 비밀번호 변경 PATCH
    updateMyPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, superstruct_1.assert)(req.body, userStructs_1.patchUserPassword);
            const { currentPassword, newPassword } = req.body;
            //로그인된 유저 확인
            const loginUser = req.user;
            if (!loginUser) {
                throw new UnauthorizedError_1.default('해당 유저가 없습니다.');
            }
            //기존 정보
            const user = yield prisma_1.default.user.findUnique({
                where: { id: loginUser.id },
            });
            //유저 확인
            if (!user) {
                throw new NotFoundError_1.default('해당 유저가 없습니다.');
            }
            //현재 비밀번호 검증
            const isValid = yield bcrypt_1.default.compare(currentPassword, user.password);
            if (!isValid)
                throw new ValidationError_1.default('비밀번호가 일치하지 않습니다.');
            //새 비밀번호 해싱
            const salt = yield bcrypt_1.default.genSalt(10);
            const hashed = yield bcrypt_1.default.hash(newPassword, salt);
            yield prisma_1.default.user.update({
                where: { id: loginUser.id },
                data: { password: hashed },
            });
            res.status(200).send({ message: '비밀번호가 변경되었습니다.' });
        });
    }
    //자신이 등록한 상품 목록 조회 GET
    getMyProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //로그인된 유저 확인
            const loginUser = req.user;
            if (!loginUser) {
                throw new UnauthorizedError_1.default('해당 유저가 없습니다.');
            }
            //등록한 상품 목록 조회
            const products = yield prisma_1.default.product.findMany({
                where: {
                    userId: loginUser.id,
                },
            });
            return res.status(200).send(products);
        });
    }
    //자신이 좋아요한 상품 목록 조회
    getLikedProducts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.user) {
                throw new ValidationError_1.default('로그인이 필요합니다.');
            }
            const userId = req.user.id;
            const existingLike = yield prisma_1.default.productLike.findFirst({
                where: { userId },
            });
            if (!existingLike) {
                throw new NotFoundError_1.default('좋아요한 상품이 없습니다.');
            }
            if (userId !== existingLike.userId) {
                throw new ForbiddenError_1.default('본인만 접근할 수 있습니다.');
            }
            //좋아요테이블에서 유저가 좋아요 한 상품 목록 조회
            const likes = yield prisma_1.default.productLike.findMany({
                where: {
                    userId,
                },
                select: {
                    productId: true,
                },
            });
            //좋아요한 상품이없으면 빈 배열 반환
            if (likes.length === 0)
                return res.send([]);
            //productId 목록 추출
            const productIds = likes.map((list) => list.productId);
            //상품 정보 가져오기
            const products = yield prisma_1.default.product.findMany({
                where: { id: { in: productIds } },
            });
            //모두 isLiked = true 붙임
            const response = products.map((product) => (Object.assign(Object.assign({}, product), { isLiked: true })));
            res.send(response);
        });
    }
}
exports.default = new UserController();
