"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const handlerFn_1 = require("../handler/handlerFn");
const productController_1 = __importDefault(require("../controller/productController"));
const authenticate_1 = require("../handler/authenticate");
const likeController_1 = __importDefault(require("../controller/likeController"));
const productRouter = express_1.default.Router();
productRouter
    .get('/', authenticate_1.authenticate, (0, handlerFn_1.asyncHandler)(productController_1.default.getProducts))
    .post('/', authenticate_1.authenticate, (0, handlerFn_1.asyncHandler)(productController_1.default.createProduct))
    .get('/:id', authenticate_1.authenticate, (0, handlerFn_1.asyncHandler)(productController_1.default.getProductById))
    .patch('/:id', authenticate_1.authenticate, (0, handlerFn_1.asyncHandler)(productController_1.default.updateProduct))
    .delete('/:id', authenticate_1.authenticate, (0, handlerFn_1.asyncHandler)(productController_1.default.deleteProduct))
    .post('/:id/comments', authenticate_1.authenticate, (0, handlerFn_1.asyncHandler)(productController_1.default.createComment))
    .get('/:id/comments', authenticate_1.authenticate, (0, handlerFn_1.asyncHandler)(productController_1.default.getComment))
    .post('/:id/like', authenticate_1.authenticate, (0, handlerFn_1.asyncHandler)(likeController_1.default.toggleLike));
exports.default = productRouter;
