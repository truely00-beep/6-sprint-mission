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
const superstruct_1 = require("superstruct");
const articleStructs_1 = require("../structs/articleStructs");
const commentStructs_1 = require("../structs/commentStructs");
const articleService_1 = __importDefault(require("../service/articleService"));
class ArticleController {
    getArticles(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { offset = '0', limit = '10', order = 'newest', search = '' } = req.query;
            const articles = yield articleService_1.default.getArticles(parseInt(offset), parseInt(limit), order, search);
            res.send(articles);
        });
    }
    createArticle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, superstruct_1.assert)(req.body, articleStructs_1.CreateArticle);
            const newArticle = yield articleService_1.default.createArticle(Object.assign(Object.assign({}, req.body), { userId: req.user.id }));
            res.status(201).send(newArticle);
        });
    }
    getArticleById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = Number(req.params.id);
            const article = yield articleService_1.default.getArticleById(id);
            res.send(article);
        });
    }
    updateArticle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, superstruct_1.assert)(req.body, articleStructs_1.PatchArticle);
            const id = Number(req.params.id);
            const loginUser = req.user;
            const updatedArticle = yield articleService_1.default.updateArticle(id, req.body, loginUser.id);
            res.send(updatedArticle);
        });
    }
    deleteArticle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = Number(req.params.id);
            const loginUser = req.user;
            yield articleService_1.default.deleteArticle(id, loginUser.id);
            res.status(204).send();
        });
    }
    createComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, superstruct_1.assert)(req.body, commentStructs_1.CreateComment);
            const articleId = Number(req.params.id);
            const { content } = req.body;
            const loginUser = req.user;
            const comments = yield articleService_1.default.createComment({
                content,
                articleId,
                userId: loginUser.id,
            });
            res.status(201).send(comments);
        });
    }
    getComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const articleId = Number(req.params.id);
            const cursor = req.query.cursor;
            const limit = parseInt(req.query.limit || '10');
            const comments = yield articleService_1.default.getComments(articleId, cursor, limit);
            res.send(comments);
        });
    }
}
exports.default = new ArticleController();
