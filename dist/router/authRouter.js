"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const handlerFn_1 = require("../handler/handlerFn");
const authController_1 = __importDefault(require("../controller/authController"));
const authRouter = express_1.default.Router();
authRouter
    .post('/register', (0, handlerFn_1.asyncHandler)(authController_1.default.register))
    .post('/login', (0, handlerFn_1.asyncHandler)(authController_1.default.login))
    .post('/refresh', (0, handlerFn_1.asyncHandler)(authController_1.default.refreshTokens))
    .post('/logout', (0, handlerFn_1.asyncHandler)(authController_1.default.logout));
exports.default = authRouter;
