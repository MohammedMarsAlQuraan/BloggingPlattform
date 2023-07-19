import { eResult } from "../common/enums";
import { DatabaseHelper } from "../database/databaseHelper";
import { DatabaseService } from "../database/databaseService";
import { SqlParameter } from "../database/models/sqlParameter";
import { Blog } from "../models/blog";
import * as mssql from 'mssql';
import { User } from "../models/user";
import { Logger } from "./logger.service";
export class UserService {

    public static async Login(pUsername: string): Promise<User> {
        try {
            return this.GetUserByUsername(pUsername);
        } catch (error) {
            Logger.log(error);
        }
    }

    public static async Register(pUser: User): Promise<eResult> {
        try {
            const tParams: SqlParameter[] = [];
            tParams.push(new SqlParameter("username", pUser.username, mssql.VarChar, false));
            tParams.push(new SqlParameter("password", pUser.password, mssql.VarChar, false));
            const tInsertStatement = await DatabaseHelper.getInsertStatement(new User());
            const tOutput: any[] = [];
            const tExecuteResult = await DatabaseService.executeCommand(tInsertStatement, tParams, tOutput);
            if (tExecuteResult === eResult.Error) {
                Logger.log("Failed to register the user");
                return eResult.Error;
            }
            return eResult.Success;
        } catch (error) {
            Logger.log(error);
            return eResult.Error;
        }
    }

    public static async isUserExisit(pUsername: string): Promise<boolean> {
        try {
            const tUser: User = await this.GetUserByUsername(pUsername);
            if (tUser) {
                return true;
            }
            return false;
        } catch (error) {
            Logger.log(error);
            return false;
        }
    }

    private static async GetUserByUsername(pUsername: string): Promise<User> {
        try {
            const tFilters: string[] = ["username"];
            const tParams: SqlParameter[] = [];
            tParams.push(new SqlParameter("username", pUsername, mssql.VarChar, false));
            const tSelectStatement = await DatabaseHelper.getSelectStatement(new User(), tFilters);
            const tOutput: any[] = [];
            const tExecuteResult = await DatabaseService.executeCommand(tSelectStatement, tParams, tOutput);
            if (tExecuteResult === eResult.Error) {
                Logger.log("Failed to login");
                return null;
            } else {
                const tUser: User = tOutput[0] as User;
                return tUser;
            }
        } catch (error) {
            Logger.log(error);
            return null;
        }
    }
}