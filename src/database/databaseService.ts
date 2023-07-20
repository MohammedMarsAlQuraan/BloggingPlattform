import { Request, ConnectionPool, Transaction } from 'mssql';
import { DBConnectionStatus, SQLErrors, eResult } from '../common/enums';
import { DatabaseConfiguration } from './databaseConfiguration';
import { SQLResult } from './models/sqlResult';
import { SqlParameter } from './models/sqlParameter';
import { Logger } from '../services/logger.service';
import { CommonMethod } from '../common/CommonMethod';
const config = require('config');

export class DatabaseService {
    public static dbConnPool: ConnectionPool;
    private static dbConnected: DBConnectionStatus = DBConnectionStatus.Disconnected;

    // tslint:disable member-ordering
    public static async start(): Promise<eResult> {
        try {
            const tUser = config.get('Database.User');
            const tPassword = config.get('Database.Password');
            const tServer = config.get('Database.Server');
            const tDBName = config.get('Database.DBName');
            const tDatabaseConfiguration: DatabaseConfiguration = new DatabaseConfiguration(tUser, tPassword, tServer, tDBName);
            return await this.open(tDatabaseConfiguration);
        } catch (error) {
            Logger.log(error);;
            return eResult.Error;
        }
    }

    public static async executeCommand(pCommand: string, pParams: SqlParameter[], pOutput: any[]): Promise<eResult> {
        try {

            if (!pOutput) {
                pOutput = [];
            }
            let tResult = eResult.Error;
            const tRequest = new Request(this.dbConnPool);
            this.addQueryParameters(tRequest, pParams);

            const tDBResult = await tRequest.query(pCommand).catch((err: Error) => { throw err; }) as SQLResult;

            if (tDBResult.rowsAffected && tDBResult.rowsAffected.length > 0) {
                if (tDBResult.rowsAffected[0] > 0) {
                    if (tDBResult.recordset && tDBResult.recordset.length > 0) {
                        tDBResult.recordset.forEach((item: any) => {
                            pOutput.push(item);
                        });
                    }
                    tResult = eResult.Success;
                } else {
                    tResult = eResult.NotFound;
                }
            }
            return tResult;
        } catch (error) {
            Logger.log(error);
            return eResult.Error;
        }
    }

    public static addQueryParameters(pRequest: Request, pParams: SqlParameter[]) {
        try {
            if (pParams && pParams.length > 0) {
                pParams.forEach((pParameter) => {
                    pRequest.input(pParameter.name, pParameter.sqltype, pParameter.value);
                });
            }
        } catch (error) {
            Logger.log(error);;
        }
    }

    private static handleWorkingStatus() {
        try {

        } catch (error) {

        }
    }

    private static handleErrorStatus() {
        try {

        } catch (error) {

        }
    }

    public static async reconnect() {
        try {
            const tRequest = DatabaseService.dbConnPool.request();
            tRequest.query('select GETDATE()',
                async (err: any) => {
                    if (err) {
                        setTimeout(DatabaseService.reconnect, 15000);
                    } else {
                        DatabaseService.handleWorkingStatus();
                    }
                });
        } catch (error) {
            Logger.log(error);
            setTimeout(DatabaseService.reconnect, 15000);
        }
    }

    public static async open(pConfig: DatabaseConfiguration): Promise<eResult> {
        let tResult: eResult = eResult.Error;
        let tTries = 3;
        while (tTries > 0) {
            try {
                if (this.dbConnPool == null) {
                    this.dbConnPool = await new ConnectionPool(pConfig).connect();
                    const that = this;
                    // Handle Errors
                    this.dbConnPool.on('error', (pError: any) => {
                        if (this.dbConnected === DBConnectionStatus.Connected) {
                            // Handle the connection error (DB service is down)
                            if (pError && pError.code === SQLErrors.Socket) {
                                Logger.log(pError);
                                if (that.dbConnPool) {
                                    that.handleErrorStatus();
                                    tTries = 0;
                                    setTimeout(that.reconnect, 15000);
                                }
                            }
                            // When a query take too long
                            if (pError && pError.code === SQLErrors.Timeout) {
                                Logger.log(pError);
                            }
                            // Other errors
                            if (pError) {
                                Logger.log(pError);
                            }
                        }
                    });
                    tResult = eResult.Success;
                } else {
                    tResult = eResult.Success;
                }
                this.handleWorkingStatus();
                return tResult;
            } catch (error) {
                tResult = eResult.Error;
                if (this.dbConnPool) {
                    this.dbConnPool.close();
                    this.dbConnPool;
                }
                Logger.log(error);
                return tResult;
            } finally {
                if (tTries > 0) {
                    tTries -= 1;
                }
            }
        }
        return eResult.Success;
    }

    public static async close() {
        try {
            if (this.dbConnPool != null) {
                await this.dbConnPool.close();
                this.dbConnPool;
            }
            return eResult.Success;
        } catch (error) {
            Logger.log(error);
            return eResult.Error;
        }
    }
}
