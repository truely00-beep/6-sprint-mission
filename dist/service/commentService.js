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
const commentRepository_1 = __importDefault(require("../repository/commentRepository"));
const ForbiddenError_1 = __importDefault(require("../lib/errors/ForbiddenError"));
const NotFoundError_1 = __importDefault(require("../lib/errors/NotFoundError"));
class CommentService {
    //댓글 수정
    updateComment(id, content, loginUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingComment = yield commentRepository_1.default.findById(id);
            if (!existingComment) {
                throw new NotFoundError_1.default('댓글이 존재하지 않습니다.');
            }
            if (existingComment.userId !== loginUserId) {
                throw new ForbiddenError_1.default('본인만 접근할 수 있습니다.');
            }
            return commentRepository_1.default.updateComment(id, content);
        });
    }
    //댓글 삭제
    deleteComment(id, loginUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingComment = yield commentRepository_1.default.findById(id);
            if (!existingComment) {
                throw new NotFoundError_1.default('댓글이 존재하지 않습니다.');
            }
            if (existingComment.userId !== loginUserId) {
                throw new ForbiddenError_1.default('본인만 접근할 수 있습니다.');
            }
            return commentRepository_1.default.deleteComment(id);
        });
    }
}
exports.default = new CommentService();
