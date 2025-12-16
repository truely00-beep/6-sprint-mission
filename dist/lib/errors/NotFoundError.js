"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class NotFoundError extends Error {
    constructor(message = '리소스를 찾을 수 없습니다.') {
        super(message);
        this.name = 'NotFoundError';
        this.status = 404;
    }
}
exports.default = NotFoundError;
