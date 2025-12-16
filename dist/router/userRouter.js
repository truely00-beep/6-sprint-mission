"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const handlerFn_1 = require("../handler/handlerFn");
const userController_1 = __importDefault(require("../controller/userController"));
const authenticate_1 = require("../handler/authenticate");
const userRouter = express_1.default.Router();
userRouter
    .get('/me', authenticate_1.authenticate, (0, handlerFn_1.asyncHandler)(userController_1.default.getMe))
    .patch('/me', authenticate_1.authenticate, (0, handlerFn_1.asyncHandler)(userController_1.default.updateMe))
    .patch('/me/password', authenticate_1.authenticate, (0, handlerFn_1.asyncHandler)(userController_1.default.updateMyPassword))
    .get('/me/products', authenticate_1.authenticate, (0, handlerFn_1.asyncHandler)(userController_1.default.getMyProduct))
    .get('/me/likes', authenticate_1.authenticate, (0, handlerFn_1.asyncHandler)(userController_1.default.getLikedProducts));
exports.default = userRouter;
