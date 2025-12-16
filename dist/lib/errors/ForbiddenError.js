"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// lib/errors/ForbiddenError.js
class ForbiddenError extends Error {
    constructor(message = '권한이 없습니다.') {
        super(message);
        this.name = 'ForbiddenError';
        this.status = 403;
    }
}
exports.default = ForbiddenError;
