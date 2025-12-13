"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultNotFoundHandler = defaultNotFoundHandler;
exports.errorHandler = errorHandler;
const superstruct_1 = require("superstruct");
const BadRequestError_1 = __importDefault(require("../lib/errors/BadRequestError"));
const NotFoundError_1 = __importDefault(require("../lib/errors/NotFoundError"));
const ConflictError_1 = __importDefault(require("../lib/errors/ConflictError"));
const ValidationError_1 = __importDefault(require("../lib/errors/ValidationError"));
const UnauthorizedError_1 = __importDefault(require("../lib/errors/UnauthorizedError"));
const ForbiddenError_1 = __importDefault(require("../lib/errors/ForbiddenError"));
const client_1 = require("@prisma/client");
function defaultNotFoundHandler(req, res, next) {
    return res.status(404).send({ message: 'Not found' });
}
function errorHandler(err, req, res, next) {
    /** From superstruct or application error */
    if (err instanceof superstruct_1.StructError || err instanceof BadRequestError_1.default) {
        return res.status(400).send({ message: err.message });
    }
    /** From express.json middleware */
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).send({ message: err.message });
    }
    /** Prisma error codes */
    if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        console.error(err);
        return res.status(500).send({ message: err.message });
    }
    /** Application error */
    if (err instanceof NotFoundError_1.default) {
        return res.status(404).send({ message: err.message });
    }
    //입력 데이터 검증 실패
    if (err instanceof ValidationError_1.default) {
        return res.status(400).send({ message: err.message });
    }
    //중복된 데이터 존재
    if (err instanceof ConflictError_1.default) {
        return res.status(409).send({ message: err.message });
    }
    //인증/인가 실패 (비밀번호 불일치)
    if (err instanceof UnauthorizedError_1.default) {
        return res.status(401).send({ message: err.message });
    }
    //권한 없음
    if (err instanceof ForbiddenError_1.default) {
        return res.status(403).send({ message: err.message });
    }
    console.error(err);
    return res.status(500).send({ message: 'Internal server error' });
}
