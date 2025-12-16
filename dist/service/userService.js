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
const NotFoundError_1 = __importDefault(require("../lib/errors/NotFoundError"));
const UnauthorizedError_1 = __importDefault(require("../lib/errors/UnauthorizedError"));
const ValidationError_1 = __importDefault(require("../lib/errors/ValidationError"));
const userRepository_1 = __importDefault(require("../repository/userRepository"));
class UserService {
    getMe(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userId) {
                throw new UnauthorizedError_1.default('해당 유저가 없습니다.');
            }
            const user = yield userRepository_1.default.findById(userId);
            if (!user) {
                throw new NotFoundError_1.default('해당 유저가 없습니다.');
            }
            const { password: _ } = user, userWithoutPassword = __rest(user, ["password"]);
            return userWithoutPassword;
        });
    }
    updateMe(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userId) {
                throw new UnauthorizedError_1.default('해당 유저가 없습니다.');
            }
            const user = yield userRepository_1.default.updateById(userId, data);
            const { password: _ } = user, userWithoutPassword = __rest(user, ["password"]);
            return userWithoutPassword;
        });
    }
    updateMyPassword(userId, currentPassword, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userId) {
                throw new UnauthorizedError_1.default('해당 유저가 없습니다.');
            }
            const user = yield userRepository_1.default.findById(userId);
            if (!user) {
                throw new NotFoundError_1.default('해당 유저가 없습니다.');
            }
            const isValid = yield bcrypt_1.default.compare(currentPassword, user.password);
            if (!isValid) {
                throw new ValidationError_1.default('비밀번호가 일치하지 않습니다.');
            }
            const hashed = yield bcrypt_1.default.hash(newPassword, 10);
            yield userRepository_1.default.updateById(userId, { password: hashed });
            return { message: '비밀번호가 변경되었습니다.' };
        });
    }
    getMyProducts(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userId) {
                throw new UnauthorizedError_1.default('해당 유저가 없습니다.');
            }
            return userRepository_1.default.findMyProducts(userId);
        });
    }
    getLikedProducts(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userId) {
                throw new ValidationError_1.default('로그인이 필요합니다.');
            }
            const likes = yield userRepository_1.default.findLikedProductIds(userId);
            if (likes.length === 0) {
                return [];
            }
            const productIds = likes.map((l) => l.productId);
            const products = yield userRepository_1.default.findProductsByIds(productIds);
            return products.map((product) => (Object.assign(Object.assign({}, product), { isLiked: true })));
        });
    }
}
exports.default = new UserService();
