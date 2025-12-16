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
class ArticleRepository {
    findArticleById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.article.findUnique({ where: { id } });
        });
    }
    updateArticle(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.article.update({
                where: { id },
                data,
            });
        });
    }
    deleteArticle(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.article.delete({
                where: { id },
            });
        });
    }
    createArticle(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.article.create({
                data,
            });
        });
    }
    findAllArticles(where, orderBy, offset, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.article.findMany({
                where,
                orderBy,
                skip: offset,
                take: limit,
            });
        });
    }
    createComment(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.comment.create({
                data,
            });
        });
    }
    getComments(articleId, cursor, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.comment.findMany(Object.assign(Object.assign({ where: { articleId: Number(articleId) }, select: {
                    id: true,
                    content: true,
                    createdAt: true,
                }, take: limit }, (cursor
                ? {
                    skip: 1,
                    cursor: { id: cursor },
                }
                : {})), { orderBy: {
                    createdAt: 'desc',
                } }));
        });
    }
}
exports.default = new ArticleRepository();
