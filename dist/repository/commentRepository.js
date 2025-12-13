"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../lib/prisma"));
class CommentRepository {
    findById(id) {
        return prisma_1.default.comment.findUnique({ where: { id } });
    }
    updateComment(id, content) {
        return prisma_1.default.comment.update({
            where: { id },
            data: { content },
        });
    }
    deleteComment(id) {
        return prisma_1.default.comment.delete({
            where: { id },
        });
    }
}
exports.default = new CommentRepository();
