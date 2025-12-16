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
const commentStructs_1 = require("../structs/commentStructs");
const ForbiddenError_1 = __importDefault(require("../lib/errors/ForbiddenError"));
const commentService_1 = __importDefault(require("../service/commentService"));
class CommentController {
    updateComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, superstruct_1.assert)(req.body, commentStructs_1.PatchComment);
            const id = Number(req.params.id);
            const { content } = req.body;
            const loginUser = req.user;
            if (!content || content.trim() === '') {
                throw new ForbiddenError_1.default('댓글 내용을 입력해주세요.');
            }
            const updated = yield commentService_1.default.updateComment(id, content, loginUser.id);
            res.send(updated);
        });
    }
    deleteComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = Number(req.params.id);
            const loginUser = req.user;
            yield commentService_1.default.deleteComment(id, loginUser.id);
            res.status(204).send();
        });
    }
}
exports.default = new CommentController();
