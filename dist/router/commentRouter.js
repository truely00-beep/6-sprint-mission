"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const handlerFn_1 = require("../handler/handlerFn");
const commentController_1 = __importDefault(require("../controller/commentController"));
const authenticate_1 = require("../handler/authenticate");
const commentRouter = express_1.default.Router();
commentRouter
    .patch('/:id', authenticate_1.authenticate, (0, handlerFn_1.asyncHandler)(commentController_1.default.updateComment))
    .delete('/:id', authenticate_1.authenticate, (0, handlerFn_1.asyncHandler)(commentController_1.default.deleteComment));
exports.default = commentRouter;
