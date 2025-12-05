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
const superstruct_1 = require("superstruct");
const commentStructs_1 = require("../structs/commentStructs");
const ForbiddenError_1 = __importDefault(require("../lib/errors/ForbiddenError"));
const NotFoundError_1 = __importDefault(require("../lib/errors/NotFoundError"));
class CommentController {
    updateComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, superstruct_1.assert)(req.body, commentStructs_1.PatchComment);
            const { id } = req.params;
            const { content } = req.body;
            const loginUser = req.user;
            const existingComment = yield prisma_1.default.comment.findUnique({ where: { id } });
            if (!existingComment) {
                throw new NotFoundError_1.default('댓글이 존재하지 않습니다.');
            }
            if (existingComment.userId !== loginUser.id) {
                throw new ForbiddenError_1.default('본인만 접근할 수 있습니다.');
            }
            const comments = yield prisma_1.default.comment.update({
                where: { id: Number(id) },
                data: { content },
            });
            res.send(comments);
        });
    }
    deleteComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const loginUser = req.user;
            const existingComment = yield prisma_1.default.comment.findUnique({ where: { id } });
            if (!existingComment) {
                throw new NotFoundError_1.default('댓글이 존재하지 않습니다.');
            }
            if (existingComment.userId !== loginUser.id) {
                throw new ForbiddenError_1.default('본인만 접근할 수 있습니다.');
            }
            const comments = yield prisma_1.default.comment.delete({
                where: { id: Number(id) },
            });
            res.sendStatus(204);
        });
    }
}
exports.default = new CommentController();
