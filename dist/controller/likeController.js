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
const likeService_1 = __importDefault(require("../service/likeService"));
const ValidationError_1 = __importDefault(require("../lib/errors/ValidationError"));
class LikeController {
    toggleLike(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.user) {
                throw new ValidationError_1.default('로그인이 필요합니다.');
            }
            const userId = req.user.id;
            const targetId = Number(req.params.id);
            const result = yield likeService_1.default.toggleLike(userId, targetId, req.baseUrl);
            res.status(200).send(result);
        });
    }
}
exports.default = new LikeController();
