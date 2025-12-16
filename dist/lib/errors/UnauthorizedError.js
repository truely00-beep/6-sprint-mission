"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UnauthorizedError extends Error {
    constructor(message = '인증/인가에 실패했습니다.') {
        super(message);
        this.name = 'UnauthorizedError';
        this.status = 401;
    }
}
exports.default = UnauthorizedError;
