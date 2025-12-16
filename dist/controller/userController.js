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
const userStructs_1 = require("../structs/userStructs");
const userService_1 = __importDefault(require("../service/userService"));
class UserController {
    getMe(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const result = yield userService_1.default.getMe((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
            res.status(200).send(result);
        });
    }
    updateMe(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            (0, superstruct_1.assert)(req.body, userStructs_1.patchUser);
            const result = yield userService_1.default.updateMe((_a = req.user) === null || _a === void 0 ? void 0 : _a.id, req.body);
            res.status(200).send(result);
        });
    }
    updateMyPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            (0, superstruct_1.assert)(req.body, userStructs_1.patchUserPassword);
            const { currentPassword, newPassword } = req.body;
            const result = yield userService_1.default.updateMyPassword((_a = req.user) === null || _a === void 0 ? void 0 : _a.id, currentPassword, newPassword);
            res.status(200).send(result);
        });
    }
    getMyProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const products = yield userService_1.default.getMyProducts((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
            res.status(200).send(products);
        });
    }
    getLikedProducts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const products = yield userService_1.default.getLikedProducts((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
            res.send(products);
        });
    }
}
exports.default = new UserController();
