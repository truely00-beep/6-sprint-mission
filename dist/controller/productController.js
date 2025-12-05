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
const prisma_1 = __importDefault(require("../lib/prisma"));
const client_1 = require("@prisma/client");
const superstruct_1 = require("superstruct");
const productStructs_1 = require("../structs/productStructs");
const commentStructs_1 = require("../structs/commentStructs");
const NotFoundError_1 = __importDefault(require("../lib/errors/NotFoundError"));
const ForbiddenError_1 = __importDefault(require("../lib/errors/ForbiddenError"));
const ValidationError_1 = __importDefault(require("../lib/errors/ValidationError"));
class ProductController {
    getProducts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { offset = '0', limit = '10', order = 'newest', search = '' } = req.query;
            let orderBy;
            switch (order) {
                case 'oldest':
                    orderBy = { createdAt: 'asc' };
                    break;
                case ' newest':
                default:
                    orderBy = { createdAt: 'desc' };
            }
            const where = search
                ? {
                    OR: [
                        { name: { contains: search, mode: 'insensitive' } },
                        { description: { contains: search, mode: 'insensitive' } },
                    ],
                }
                : {};
            //상품 목록 가져오기
            const products = yield prisma_1.default.product.findMany({
                where,
                orderBy,
                skip: parseInt(offset),
                take: parseInt(limit),
            });
            res.send(products);
        });
    }
    createProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, superstruct_1.assert)(req.body, productStructs_1.CreateProduct);
            const userId = req.user.id;
            const _a = req.body, { category } = _a, rest = __rest(_a, ["category"]);
            if (!Object.values(client_1.Category).includes(category)) {
                throw new ForbiddenError_1.default('유효하지 않은 카테고리입니다.');
            }
            const products = yield prisma_1.default.product.create({
                data: Object.assign(Object.assign({}, rest), { category: category, userId }),
            });
            res.status(201).send(products);
        });
    }
    getProductById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const product = yield prisma_1.default.product.findUnique({
                where: { id: Number(id) },
            });
            if (!product) {
                throw new NotFoundError_1.default('해당 상품이 없습니다.');
            }
            //반환
            return res.send(product);
        });
    }
    updateProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, superstruct_1.assert)(req.body, productStructs_1.PatchProduct);
            const { id } = req.params;
            const _a = req.body, { category } = _a, rest = __rest(_a, ["category"]);
            if (!Object.values(client_1.Category).includes(category)) {
                throw new ForbiddenError_1.default('유효하지 않은 카테고리입니다.');
            }
            const loginUser = req.user;
            const existingProduct = yield prisma_1.default.article.findUnique({ where: { id } });
            if (!existingProduct) {
                throw new NotFoundError_1.default('해당 상품이 없습니다.');
            }
            if (loginUser.id !== existingProduct.id) {
                throw new ForbiddenError_1.default('본인만 접근할 수 있습니다.');
            }
            const products = yield prisma_1.default.product.update({
                where: { id: Number(id) },
                data: Object.assign(Object.assign({}, rest), { category: category }),
            });
            res.send(products);
        });
    }
    deleteProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const loginUser = req.user;
            if (!loginUser) {
                throw new ValidationError_1.default('로그인이 필요합니다.');
            }
            const existingProduct = yield prisma_1.default.article.findUnique({ where: { id } });
            if (!existingProduct) {
                throw new NotFoundError_1.default('해당 상품이 없습니다.');
            }
            if (loginUser.id !== existingProduct.id) {
                throw new ForbiddenError_1.default('본인만 접근할 수 있습니다.');
            }
            const products = yield prisma_1.default.product.delete({
                where: { id: Number(id) },
            });
            res.sendStatus(204);
        });
    }
    createComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, superstruct_1.assert)(req.body, commentStructs_1.CreateComment);
            const { id } = req.params;
            const { content } = req.body;
            const comments = yield prisma_1.default.comment.create({
                data: {
                    content,
                    product: {
                        connect: { id: Number(id) },
                    },
                },
                include: {
                    product: true,
                },
            });
            res.status(201).send(comments);
        });
    }
    getComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { cursor, limit = '10' } = req.query;
            const comments = yield prisma_1.default.comment.findMany(Object.assign(Object.assign({ where: { productId: Number(id) }, select: {
                    id: true,
                    content: true,
                    createdAt: true,
                }, take: parseInt(limit) }, (cursor
                ? {
                    skip: 1,
                    cursor: { id: cursor },
                }
                : {})), { orderBy: {
                    createdAt: 'desc',
                } }));
            const nextCursor = comments.length > 0 ? comments[comments.length - 1].id : null;
            res.send({
                data: comments,
                nextCursor,
            });
        });
    }
}
exports.default = new ProductController();
