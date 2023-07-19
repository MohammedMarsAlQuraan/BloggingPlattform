"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SqlParameter = void 0;
class SqlParameter {
    constructor(name, value, sqlType, isOut) {
        this.name = name;
        this.value = value;
        this.sqltype = sqlType;
        this.isOut = isOut;
    }
}
exports.SqlParameter = SqlParameter;
