"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseConfiguration = void 0;
class DatabaseConfiguration {
    constructor(pUser, pPassword, pServer, pDatabase) {
        this.user = pUser;
        this.password = pPassword;
        this.server = pServer;
        this.database = pDatabase;
    }
}
exports.DatabaseConfiguration = DatabaseConfiguration;
