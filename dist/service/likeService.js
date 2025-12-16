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
const likeRepository_1 = __importDefault(require("../repository/likeRepository"));
const ValidationError_1 = __importDefault(require("../lib/errors/ValidationError"));
class LikeService {
    toggleLike(userId, targetId, baseUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!targetId) {
                throw new ValidationError_1.default('유효하지 않은 targetId입니다.');
            }
            const type = baseUrl.includes('/products') ? 'Product' : 'Article';
            const existing = yield likeRepository_1.default.findExistingLike(type, userId, targetId);
            const isLiked = yield likeRepository_1.default.toggleLikeTransaction(type, userId, targetId, existing === null || existing === void 0 ? void 0 : existing.id);
            return {
                isLiked,
                message: isLiked ? '좋아요 등록됨' : '좋아요 해제됨',
            };
        });
    }
}
exports.default = new LikeService();
