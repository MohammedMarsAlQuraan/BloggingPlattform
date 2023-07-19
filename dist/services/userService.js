"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.UserService = void 0;
const enums_1 = require("../common/enums");
const databaseHelper_1 = require("../database/databaseHelper");
const databaseService_1 = require("../database/databaseService");
const sqlParameter_1 = require("../database/models/sqlParameter");
const mssql = __importStar(require("mssql"));
const user_1 = require("../models/user");
const logger_service_1 = require("./logger.service");
class UserService {
    static Login(pUsername) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.GetUserByUsername(pUsername);
            }
            catch (error) {
                logger_service_1.Logger.log(error);
            }
        });
    }
    static Register(pUser) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tParams = [];
                tParams.push(new sqlParameter_1.SqlParameter("username", pUser.username, mssql.VarChar, false));
                tParams.push(new sqlParameter_1.SqlParameter("password", pUser.password, mssql.VarChar, false));
                const tInsertStatement = yield databaseHelper_1.DatabaseHelper.getInsertStatement(new user_1.User());
                const tOutput = [];
                const tExecuteResult = yield databaseService_1.DatabaseService.executeCommand(tInsertStatement, tParams, tOutput);
                if (tExecuteResult === enums_1.eResult.Error) {
                    logger_service_1.Logger.log("Failed to register the user");
                    return enums_1.eResult.Error;
                }
                return enums_1.eResult.Success;
            }
            catch (error) {
                logger_service_1.Logger.log(error);
                return enums_1.eResult.Error;
            }
        });
    }
    static isUserExisit(pUsername) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tUser = yield this.GetUserByUsername(pUsername);
                if (tUser) {
                    return true;
                }
                return false;
            }
            catch (error) {
                logger_service_1.Logger.log(error);
                return false;
            }
        });
    }
    static GetUserByUsername(pUsername) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tFilters = ["username"];
                const tParams = [];
                tParams.push(new sqlParameter_1.SqlParameter("username", pUsername, mssql.VarChar, false));
                const tSelectStatement = yield databaseHelper_1.DatabaseHelper.getSelectStatement(new user_1.User(), tFilters);
                const tOutput = [];
                const tExecuteResult = yield databaseService_1.DatabaseService.executeCommand(tSelectStatement, tParams, tOutput);
                if (tExecuteResult === enums_1.eResult.Error) {
                    logger_service_1.Logger.log("Failed to login");
                    return null;
                }
                else {
                    const tUser = tOutput[0];
                    return tUser;
                }
            }
            catch (error) {
                logger_service_1.Logger.log(error);
                return null;
            }
        });
    }
}
exports.UserService = UserService;
