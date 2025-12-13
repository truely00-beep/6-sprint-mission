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
const prisma_1 = __importDefault(require("../lib/prisma"));
class LikeRepository {
    findExistingLike(type, userId, targetId) {
        if (type === 'Product') {
            return prisma_1.default.productLike.findFirst({
                where: { userId, productId: targetId },
                select: { id: true },
            });
        }
        return prisma_1.default.articleLike.findFirst({
            where: { userId, articleId: targetId },
            select: { id: true },
        });
    }
    toggleLikeTransaction(type, userId, targetId, existingLikeId) {
        return __awaiter(this, void 0, void 0, function* () {
            let isLiked = false;
            yield prisma_1.default.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                if (existingLikeId) {
                    // 좋아요 삭제
                    if (type === 'Product') {
                        yield tx.productLike.delete({ where: { id: existingLikeId } });
                        yield tx.product.update({
                            where: { id: targetId },
                            data: { likeCount: { decrement: 1 } },
                        });
                    }
                    else {
                        yield tx.articleLike.delete({ where: { id: existingLikeId } });
                        yield tx.article.update({
                            where: { id: targetId },
                            data: { likeCount: { decrement: 1 } },
                        });
                    }
                }
                else {
                    // 좋아요 생성
                    if (type === 'Product') {
                        yield tx.productLike.create({
                            data: { userId, productId: targetId },
                        });
                        yield tx.product.update({
                            where: { id: targetId },
                            data: { likeCount: { increment: 1 } },
                        });
                    }
                    else {
                        yield tx.articleLike.create({
                            data: { userId, articleId: targetId },
                        });
                        yield tx.article.update({
                            where: { id: targetId },
                            data: { likeCount: { increment: 1 } },
                        });
                    }
                    isLiked = true;
                }
            }));
            return isLiked;
        });
    }
}
exports.default = new LikeRepository();
