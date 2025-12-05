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
const prisma_js_1 = __importDefault(require("../lib/prisma.js"));
const superstruct_1 = require("superstruct");
const articleStructs_1 = require("../structs/articleStructs");
const commentStructs_1 = require("../structs/commentStructs");
const NotFoundError_1 = __importDefault(require("../lib/errors/NotFoundError"));
const ForbiddenError_1 = __importDefault(require("../lib/errors/ForbiddenError"));
class ArticleController {
    getArticles(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { offset = '0', limit = '10', order = 'newest', search = '' } = req.query;
            let orderBy;
            switch (order) {
                case 'oldest':
                    orderBy = { createdAt: 'asc' };
                    break;
                case 'newest':
                default:
                    orderBy = { createdAt: 'desc' };
            }
            const where = search
                ? {
                    OR: [
                        { title: { contains: search, mode: 'insensitive' } },
                        { content: { contains: search, mode: 'insensitive' } },
                    ],
                }
                : {};
            //게시물 목록 가져오기
            const articles = yield prisma_js_1.default.article.findMany({
                where,
                orderBy,
                skip: parseInt(offset),
                take: parseInt(limit),
            });
            res.send(articles);
        });
    }
    createArticle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, superstruct_1.assert)(req.body, articleStructs_1.CreateArticle);
            const userId = req.user.id;
            const articles = yield prisma_js_1.default.article.create({
                data: Object.assign(Object.assign({}, req.body), { userId }),
            });
            res.status(201).send(articles);
        });
    }
    getArticleById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const article = yield prisma_js_1.default.article.findUnique({
                where: { id: Number(id) },
            });
            if (!article)
                throw new NotFoundError_1.default('해당 게시글이 없습니다.');
            //반환
            return res.send(article);
        });
    }
    updateArticle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, superstruct_1.assert)(req.body, articleStructs_1.PatchArticle);
            const { id } = req.params;
            const loginUser = req.user;
            const existingArticle = yield prisma_js_1.default.article.findUnique({ where: { id } });
            if (!existingArticle) {
                throw new NotFoundError_1.default('게시글이 존재하지 않습니다.');
            }
            if (loginUser.id !== existingArticle.userId) {
                throw new ForbiddenError_1.default('본인만 접근할 수 있습니다.');
            }
            const articles = yield prisma_js_1.default.article.update({
                where: { id: Number(id) },
                data: req.body,
            });
            res.send(articles);
        });
    }
    deleteArticle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const loginUser = req.user;
            const existingArticle = yield prisma_js_1.default.article.findUnique({ where: { id } });
            if (!existingArticle) {
                throw new NotFoundError_1.default('게시글이 존재하지 않습니다.');
            }
            if (loginUser.id !== existingArticle.userId) {
                throw new ForbiddenError_1.default('본인만 접근할 수 있습니다.');
            }
            const articles = yield prisma_js_1.default.article.delete({
                where: { id: Number(id) },
            });
            res.sendStatus(204);
        });
    }
    createComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, superstruct_1.assert)(req.body, commentStructs_1.CreateComment);
            const { id: articleId } = req.params;
            const { content } = req.body;
            const comments = yield prisma_js_1.default.comment.create({
                data: {
                    content,
                    article: {
                        connect: { id: Number(articleId) },
                    },
                },
                include: {
                    article: true,
                },
            });
            res.status(201).send(comments);
        });
    }
    getComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id: articleId } = req.params;
            const { cursor, limit = '10' } = req.query;
            const comments = yield prisma_js_1.default.comment.findMany(Object.assign(Object.assign({ where: { articleId: Number(articleId) }, select: {
                    id: true,
                    content: true,
                    createdAt: true,
                }, take: parseInt(limit) }, (cursor
                ? {
                    skip: 1,
                    cursor: { id: cursor },
                }
                : {})), { orderBy: {
                    createdAt: 'desc',
                } }));
            const nextCursor = comments.length > 0 ? comments[comments.length - 1].id : null;
            res.send({
                data: comments,
                nextCursor,
            });
        });
    }
}
exports.default = new ArticleController();
