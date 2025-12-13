"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../lib/prisma"));
class UserRepository {
    findById(id) {
        return prisma_1.default.user.findUnique({ where: { id } });
    }
    updateById(id, data) {
        return prisma_1.default.user.update({
            where: { id },
            data,
        });
    }
    findMyProducts(userId) {
        return prisma_1.default.product.findMany({
            where: { userId },
        });
    }
    findLikedProductIds(userId) {
        return prisma_1.default.productLike.findMany({
            where: { userId },
            select: { productId: true },
        });
    }
    findProductsByIds(ids) {
        return prisma_1.default.product.findMany({
            where: { id: { in: ids } },
        });
    }
}
exports.default = new UserRepository();
