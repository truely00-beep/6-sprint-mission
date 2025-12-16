"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const handlerFn_1 = require("../handler/handlerFn");
const articleController_1 = __importDefault(require("../controller/articleController"));
const authenticate_1 = require("../handler/authenticate");
const likeController_1 = __importDefault(require("../controller/likeController"));
const articleRouter = express_1.default.Router();
articleRouter
    .get('/', authenticate_1.authenticate, (0, handlerFn_1.asyncHandler)(articleController_1.default.getArticles))
    .post('/', authenticate_1.authenticate, (0, handlerFn_1.asyncHandler)(articleController_1.default.createArticle))
    .get('/:id', authenticate_1.authenticate, (0, handlerFn_1.asyncHandler)(articleController_1.default.getArticleById))
    .patch('/:id', authenticate_1.authenticate, (0, handlerFn_1.asyncHandler)(articleController_1.default.updateArticle))
    .delete('/:id', authenticate_1.authenticate, (0, handlerFn_1.asyncHandler)(articleController_1.default.deleteArticle))
    .post('/:id/comments', authenticate_1.authenticate, (0, handlerFn_1.asyncHandler)(articleController_1.default.createComment))
    .get('/:id/comments', authenticate_1.authenticate, (0, handlerFn_1.asyncHandler)(articleController_1.default.getComment))
    .post('/:id/like', authenticate_1.authenticate, (0, handlerFn_1.asyncHandler)(likeController_1.default.toggleLike));
exports.default = articleRouter;
