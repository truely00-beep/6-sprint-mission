"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ValidationError extends Error {
    constructor(message = '입력값이 없습니다.') {
        super(message);
        this.name = 'ValidationError';
        this.status = 400;
    }
}
exports.default = ValidationError;
