"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
class User {
    constructor(pUsername = "", pPassword = "") {
        this.id = -1;
        this.username = pUsername;
        this.password = pPassword;
    }
}
exports.User = User;
