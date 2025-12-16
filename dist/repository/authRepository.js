"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../lib/prisma"));
class AuthRepository {
    findByNickname(nickname) {
        return prisma_1.default.user.findFirst({ where: { nickname } });
    }
    createUser(email, nickname, hashedPassword) {
        return prisma_1.default.user.create({
            data: { email, nickname, password: hashedPassword },
        });
    }
    findById(id) {
        return prisma_1.default.user.findUnique({ where: { id } });
    }
}
exports.default = new AuthRepository();
