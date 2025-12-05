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
const ValidationError_1 = __importDefault(require("../lib/errors/ValidationError"));
const prisma_1 = __importDefault(require("../lib/prisma"));
class LikeController {
    toggleLike(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.user) {
                throw new ValidationError_1.default('로그인이 필요합니다.');
            }
            const userId = req.user.id;
            const targetId = req.params.id;
            if (!targetId)
                throw new ValidationError_1.default('유효하지 않은 targetId입니다.');
            // console.log('baseUrl:', req.baseUrl);
            // console.log('path:', req.path);
            // console.log('originalUrl:', req.originalUrl);
            //어떤 라우터로 들어왔는지 확인 - /products/1/like
            const type = req.baseUrl.includes('/products') ? 'Product' : 'Article';
            //기존 좋아요 여부 확인
            let existing;
            if (type === 'Product') {
                existing = yield prisma_1.default.productLike.findFirst({
                    where: {
                        userId,
                        productId: Number(targetId),
                    },
                    select: { id: true },
                });
            }
            else {
                existing = yield prisma_1.default.articleLike.findFirst({
                    where: {
                        userId,
                        articleId: Number(targetId),
                    },
                    select: { id: true },
                });
            }
            let isLiked = false;
            yield prisma_1.default.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                if (existing) {
                    //좋아요 취소
                    if (type === 'Product') {
                        yield tx.productLike.delete({
                            where: { id: existing.id },
                        });
                    }
                    else {
                        yield tx.articleLike.delete({
                            where: { id: existing.id },
                        });
                    }
                    //카운트 감소
                    if (type === 'Product') {
                        yield tx.product.update({
                            where: { id: Number(targetId) },
                            data: { likeCount: { decrement: 1 } },
                        });
                    }
                    else {
                        yield tx.article.update({
                            where: { id: Number(targetId) },
                            data: { likeCount: { decrement: 1 } },
                        });
                    }
                }
                else {
                    //좋아요 등록
                    if (type === 'Product') {
                        yield tx.productLike.create({
                            data: {
                                userId,
                                productId: Number(targetId), //상품에 좋아요 누를 경우
                            },
                        });
                    }
                    else {
                        yield tx.articleLike.create({
                            data: {
                                userId,
                                articleId: Number(targetId), //게시글에 좋아요 누를 경우
                            },
                        });
                    }
                    // 좋아요 카운트 증가
                    if (type === 'Product') {
                        yield tx.product.update({
                            where: { id: Number(targetId) },
                            data: { likeCount: { increment: 1 } },
                        });
                    }
                    else {
                        yield tx.article.update({
                            where: { id: Number(targetId) },
                            data: { likeCount: { increment: 1 } },
                        });
                    }
                    isLiked = true;
                }
            }));
            return res.status(200).send({
                message: isLiked ? '좋아요 등록됨' : '좋아요 해제됨',
                isLiked,
            });
        });
    }
}
exports.default = new LikeController();
