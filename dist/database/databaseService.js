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
exports.DatabaseService = void 0;
const mssql_1 = require("mssql");
const enums_1 = require("../common/enums");
const databaseConfiguration_1 = require("./databaseConfiguration");
const logger_service_1 = require("../services/logger.service");
class DatabaseService {
    // tslint:disable member-ordering
    static start() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tDatabaseConfiguration = new databaseConfiguration_1.DatabaseConfiguration("sa", "sedco@123", "localhost", "blogging");
                return yield this.open(tDatabaseConfiguration);
            }
            catch (error) {
                logger_service_1.Logger.log(error);
                ;
                return enums_1.eResult.Error;
            }
        });
    }
    static executeCommand(pCommand, pParams, pOutput) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!pOutput) {
                    pOutput = [];
                }
                let tResult = enums_1.eResult.Error;
                const tRequest = new mssql_1.Request(this.dbConnPool);
                this.addQueryParameters(tRequest, pParams);
                const tDBResult = yield tRequest.query(pCommand).catch((err) => { throw err; });
                if (tDBResult.rowsAffected && tDBResult.rowsAffected.length > 0) {
                    if (tDBResult.rowsAffected[0] > 0) {
                        if (tDBResult.recordset && tDBResult.recordset.length > 0) {
                            tDBResult.recordset.forEach((item) => {
                                pOutput.push(item);
                            });
                        }
                        tResult = enums_1.eResult.Success;
                    }
                    else {
                        tResult = enums_1.eResult.NotFound;
                    }
                }
                return tResult;
            }
            catch (error) {
                logger_service_1.Logger.log(error);
                return enums_1.eResult.Error;
            }
        });
    }
    static addQueryParameters(pRequest, pParams) {
        try {
            if (pParams && pParams.length > 0) {
                pParams.forEach((pParameter) => {
                    pRequest.input(pParameter.name, pParameter.sqltype, pParameter.value);
                });
            }
        }
        catch (error) {
            logger_service_1.Logger.log(error);
            ;
        }
    }
    static handleWorkingStatus() {
        try {
        }
        catch (error) {
        }
    }
    static handleErrorStatus() {
        try {
        }
        catch (error) {
        }
    }
    static reconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tRequest = DatabaseService.dbConnPool.request();
                tRequest.query('select GETDATE()', (err) => __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        setTimeout(DatabaseService.reconnect, 15000);
                    }
                    else {
                        DatabaseService.handleWorkingStatus();
                    }
                }));
            }
            catch (error) {
                logger_service_1.Logger.log(error);
                setTimeout(DatabaseService.reconnect, 15000);
            }
        });
    }
    static open(pConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            let tResult = enums_1.eResult.Error;
            let tTries = 3;
            while (tTries > 0) {
                try {
                    if (this.dbConnPool == null) {
                        this.dbConnPool = yield new mssql_1.ConnectionPool(pConfig).connect();
                        const that = this;
                        // Handle Errors
                        this.dbConnPool.on('error', (pError) => {
                            if (this.dbConnected === enums_1.DBConnectionStatus.Connected) {
                                // Handle the connection error (DB service is down)
                                if (pError && pError.code === enums_1.SQLErrors.Socket) {
                                    logger_service_1.Logger.log(pError);
                                    if (that.dbConnPool) {
                                        that.handleErrorStatus();
                                        tTries = 0;
                                        setTimeout(that.reconnect, 15000);
                                    }
                                }
                                // When a query take too long
                                if (pError && pError.code === enums_1.SQLErrors.Timeout) {
                                    logger_service_1.Logger.log(pError);
                                }
                                // Other errors
                                if (pError) {
                                    logger_service_1.Logger.log(pError);
                                }
                            }
                        });
                        tResult = enums_1.eResult.Success;
                    }
                    else {
                        tResult = enums_1.eResult.Success;
                    }
                    this.handleWorkingStatus();
                    return tResult;
                }
                catch (error) {
                    tResult = enums_1.eResult.Error;
                    if (this.dbConnPool) {
                        this.dbConnPool.close();
                        this.dbConnPool;
                    }
                    logger_service_1.Logger.log(error);
                    return tResult;
                }
                finally {
                    if (tTries > 0) {
                        tTries -= 1;
                    }
                }
            }
            return enums_1.eResult.Success;
        });
    }
    static close() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (this.dbConnPool != null) {
                    yield this.dbConnPool.close();
                    this.dbConnPool;
                }
                return enums_1.eResult.Success;
            }
            catch (error) {
                logger_service_1.Logger.log(error);
                return enums_1.eResult.Error;
            }
        });
    }
}
exports.DatabaseService = DatabaseService;
DatabaseService.dbConnected = enums_1.DBConnectionStatus.Disconnected;
