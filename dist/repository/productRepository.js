"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../lib/prisma"));
class ProductRepository {
    findMany(where, orderBy, offset, limit) {
        return prisma_1.default.product.findMany({
            where,
            orderBy,
            skip: offset,
            take: limit,
        });
    }
    create(data) {
        return prisma_1.default.product.create({ data });
    }
    findById(id) {
        return prisma_1.default.product.findUnique({ where: { id } });
    }
    update(id, data) {
        return prisma_1.default.product.update({
            where: { id },
            data,
        });
    }
    delete(id) {
        return prisma_1.default.product.delete({ where: { id } });
    }
    createComment(productId, content) {
        return prisma_1.default.comment.create({
            data: {
                content,
                product: { connect: { id: productId } },
            },
            include: { product: true },
        });
    }
    getComments(productId, cursor, limit) {
        return prisma_1.default.comment.findMany(Object.assign(Object.assign({ where: { productId }, select: {
                id: true,
                content: true,
                createdAt: true,
            }, take: limit }, (cursor
            ? {
                skip: 1,
                cursor: { id: cursor },
            }
            : {})), { orderBy: { createdAt: 'desc' } }));
    }
}
exports.default = new ProductRepository();
