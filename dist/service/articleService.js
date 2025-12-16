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
const articleRepository_1 = __importDefault(require("../repository/articleRepository"));
const ForbiddenError_1 = __importDefault(require("../lib/errors/ForbiddenError"));
const NotFoundError_1 = __importDefault(require("../lib/errors/NotFoundError"));
class ArticleService {
    //게시물 목록 조회
    getArticles(offset, limit, order, search) {
        return __awaiter(this, void 0, void 0, function* () {
            const orderBy = order === 'oldest' ? { createdAt: 'asc' } : { createdAt: 'desc' };
            const where = search
                ? {
                    OR: [
                        { title: { contains: search, mode: 'insensitive' } },
                        { content: { contains: search, mode: 'insensitive' } },
                    ],
                }
                : {};
            return articleRepository_1.default.findAllArticles(where, orderBy, offset, limit);
        });
    }
    //게시물 생성
    createArticle(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return articleRepository_1.default.createArticle(data);
        });
    }
    //게시물 상세 조회
    getArticleById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const article = yield articleRepository_1.default.findArticleById(id);
            if (!article) {
                throw new NotFoundError_1.default('게시글이 존재하지 않습니다.');
            }
            return article;
        });
    }
    //게시물 수정
    updateArticle(id, data, loginUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingArticle = yield articleRepository_1.default.findArticleById(id);
            if (!existingArticle) {
                throw new NotFoundError_1.default('게시글이 존재하지 않습니다.');
            }
            if (existingArticle.userId !== loginUserId) {
                throw new ForbiddenError_1.default('본인만 접근할 수 있습니다.');
            }
            return articleRepository_1.default.updateArticle(id, data);
        });
    }
    //게시물 삭제
    deleteArticle(id, loginUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingArticle = yield articleRepository_1.default.findArticleById(id);
            if (!existingArticle) {
                throw new NotFoundError_1.default('게시글이 존재하지 않습니다.');
            }
            if (existingArticle.userId !== loginUserId) {
                throw new ForbiddenError_1.default('본인만 접근할 수 있습니다.');
            }
            return articleRepository_1.default.deleteArticle(id);
        });
    }
    //댓글 생성
    createComment(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return articleRepository_1.default.createComment(data);
        });
    }
    //댓글 목록 조회
    getComments(articleId, cursor, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const comments = yield articleRepository_1.default.getComments(articleId, cursor, limit);
            const nextCursor = comments.length > 0 ? comments[comments.length - 1].id : null;
            return { data: comments, nextCursor };
        });
    }
}
exports.default = new ArticleService();
