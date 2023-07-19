"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationService = void 0;
const authenticatedUser_1 = require("../models/authenticatedUser");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authConfig_1 = require("../../config/authConfig");
const logger_service_1 = require("./logger.service");
class AuthenticationService {
    static verfiy(pToken) {
        return new Promise((resolve, reject) => {
            try {
                jsonwebtoken_1.default.verify(pToken, authConfig_1.jwtSecret, (err, decoded) => {
                    if (err) {
                        logger_service_1.Logger.log(err);
                        resolve(null);
                        return;
                    }
                    if (decoded) {
                        const tAuthenticatedUser = new authenticatedUser_1.AuthenticatedUser(decoded._id, decoded.name);
                        resolve(tAuthenticatedUser);
                        return;
                    }
                });
                resolve(null);
                return;
            }
            catch (error) {
                logger_service_1.Logger.log(error);
                ;
                resolve(null);
                return;
            }
        });
    }
    static generateToken(pUserId, pUsername) {
        try {
            if (pUserId != -1 && pUsername) {
                const token = jsonwebtoken_1.default.sign({ _id: pUserId === null || pUserId === void 0 ? void 0 : pUserId.toString(), name: pUsername }, authConfig_1.jwtSecret, {
                    expiresIn: authConfig_1.jwtExpiration,
                });
                return token;
            }
            return "";
        }
        catch (error) {
            logger_service_1.Logger.log(error);
            ;
            return "";
        }
    }
}
exports.AuthenticationService = AuthenticationService;
