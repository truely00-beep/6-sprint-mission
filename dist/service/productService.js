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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const productRepository_1 = __importDefault(require("../repository/productRepository"));
const ForbiddenError_1 = __importDefault(require("../lib/errors/ForbiddenError"));
const NotFoundError_1 = __importDefault(require("../lib/errors/NotFoundError"));
class ProductService {
    getProducts(offset, limit, order, search) {
        const orderBy = order === 'oldest' ? { createdAt: 'asc' } : { createdAt: 'desc' };
        const where = search
            ? {
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { description: { contains: search, mode: 'insensitive' } },
                ],
            }
            : {};
        return productRepository_1.default.findMany(where, orderBy, offset, limit);
    }
    createProduct(data, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.validateCategory(data.category);
            const { category } = data, rest = __rest(data, ["category"]);
            return productRepository_1.default.create(Object.assign(Object.assign({}, rest), { category: category, userId }));
        });
    }
    getProductById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield productRepository_1.default.findById(id);
            if (!product)
                throw new NotFoundError_1.default('해당 상품이 없습니다.');
            return product;
        });
    }
    updateProduct(id, data, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.validateCategory(data.category);
            const existing = yield productRepository_1.default.findById(id);
            if (!existing)
                throw new NotFoundError_1.default('해당 상품이 없습니다.');
            if (existing.userId !== userId) {
                throw new ForbiddenError_1.default('본인만 접근할 수 있습니다.');
            }
            const { category } = data, rest = __rest(data, ["category"]);
            return productRepository_1.default.update(id, Object.assign(Object.assign({}, rest), { category: category }));
        });
    }
    deleteProduct(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const existing = yield productRepository_1.default.findById(id);
            if (!existing)
                throw new NotFoundError_1.default('해당 상품이 없습니다.');
            if (existing.userId !== userId) {
                throw new ForbiddenError_1.default('본인만 접근할 수 있습니다.');
            }
            yield productRepository_1.default.delete(id);
        });
    }
    createComment(productId, content) {
        return productRepository_1.default.createComment(productId, content);
    }
    getComments(productId, cursor, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const comments = yield productRepository_1.default.getComments(productId, cursor, limit);
            return {
                data: comments,
                nextCursor: comments.length > 0 ? comments[comments.length - 1].id : null,
            };
        });
    }
    validateCategory(category) {
        if (!Object.values(client_1.Category).includes(category)) {
            throw new ForbiddenError_1.default('유효하지 않은 카테고리입니다.');
        }
    }
}
exports.default = new ProductService();
