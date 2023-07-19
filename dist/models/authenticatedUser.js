"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticatedUser = void 0;
const logger_service_1 = require("../services/logger.service");
class AuthenticatedUser {
    constructor(pId, pUsername) {
        this.id = -1;
        this.username = "";
        this.id = pId;
        this.username = pUsername;
    }
    isValid() {
        try {
            const tIsValid = Object.values(this).every(value => {
                if (value !== null) {
                    return true;
                }
                return false;
            });
            return tIsValid;
        }
        catch (error) {
            logger_service_1.Logger.log(error);
            ;
            return false;
        }
    }
}
exports.AuthenticatedUser = AuthenticatedUser;
