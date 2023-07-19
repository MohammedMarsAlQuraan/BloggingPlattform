"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonMethod = void 0;
class CommonMethod {
    static isStringEmptyOrUndefiend(str) {
        return str === null || str === undefined || str.trim() === '';
    }
}
exports.CommonMethod = CommonMethod;
