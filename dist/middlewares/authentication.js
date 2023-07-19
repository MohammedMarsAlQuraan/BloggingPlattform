"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateTokenMiddleware = void 0;
const authenticationService_1 = require("../services/authenticationService");
const logger_service_1 = require("../services/logger.service");
const ResponseResult_1 = require("../models/ResponseResult");
const enums_1 = require("../common/enums");
const authenticateTokenMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const tAuthenticatedUser = yield authenticationService_1.AuthenticationService.verfiy(token);
        if (tAuthenticatedUser && tAuthenticatedUser.isValid()) {
            res.locals.user = tAuthenticatedUser;
            next();
        }
        else {
            res.status(401).json(new ResponseResult_1.ResponseResult(enums_1.eResult.Error, 'Not Authenticated', null));
            return;
        }
    }
    catch (error) {
        logger_service_1.Logger.log(error);
        return;
    }
});
exports.authenticateTokenMiddleware = authenticateTokenMiddleware;
