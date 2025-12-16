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
const productStructs_1 = require("../structs/productStructs");
const commentStructs_1 = require("../structs/commentStructs");
const productService_1 = __importDefault(require("../service/productService"));
class ProductController {
    getProducts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { offset = '0', limit = '10', order = 'newest', search = '' } = req.query;
            const products = yield productService_1.default.getProducts(parseInt(offset), parseInt(limit), order, search);
            res.send(products);
        });
    }
    createProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, superstruct_1.assert)(req.body, productStructs_1.CreateProduct);
            const product = yield productService_1.default.createProduct(req.body, req.user.id);
            res.status(201).send(product);
        });
    }
    getProductById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = Number(req.params.id);
            const product = yield productService_1.default.getProductById(id);
            res.send(product);
        });
    }
    updateProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, superstruct_1.assert)(req.body, productStructs_1.PatchProduct);
            const id = Number(req.params.id);
            const updated = yield productService_1.default.updateProduct(id, req.body, req.user.id);
            res.send(updated);
        });
    }
    deleteProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = Number(req.params.id);
            yield productService_1.default.deleteProduct(id, req.user.id);
            res.sendStatus(204);
        });
    }
    createComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, superstruct_1.assert)(req.body, commentStructs_1.CreateComment);
            const productId = Number(req.params.id);
            const { content } = req.body;
            const comment = yield productService_1.default.createComment(productId, content);
            res.status(201).send(comment);
        });
    }
    getComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const productId = Number(req.params.id);
            const cursor = req.query.cursor;
            const limit = parseInt(req.query.limit || '10');
            const result = yield productService_1.default.getComments(productId, cursor, limit);
            res.send(result);
        });
    }
}
exports.default = new ProductController();
