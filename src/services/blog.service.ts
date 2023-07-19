import { OrderByDirection, eResult } from "../common/enums";
import { DatabaseHelper } from "../database/databaseHelper";
import { DatabaseService } from "../database/databaseService";
import { SqlParameter } from "../database/models/sqlParameter";
import { Blog } from "../models/blog";
import * as mssql from 'mssql';
import { Logger } from "./logger.service";
export class BlogService {

    public static async GetAllBlogs(pUserId: number, pOrderBy?: string, pOrderByDirection?: OrderByDirection, pOffset: number = -1, pLimit: number = -1): Promise<Blog[]> {
        try {
            const tFilters: string[] = ["Author_Id"];
            const tParams: SqlParameter[] = [];
            tParams.push(new SqlParameter("Author_Id", pUserId, mssql.BigInt, false));
            const tSelectStatement = await DatabaseHelper.getSelectStatement(new Blog(), tFilters, pOrderBy, pOrderByDirection, pOffset, pLimit);
            const tOutput: any[] = [];
            const tExecuteResult = await DatabaseService.executeCommand(tSelectStatement, tParams, tOutput);
            if (tExecuteResult === eResult.Error) {
                Logger.log("Failed to execute get blogs command");
                return [];
            } else {
                const tBlogs: Blog[] = tOutput as Blog[];
                return tBlogs;
            }
        } catch (error) {
            Logger.log(error);;
        }
    }

    public static async GetBlogByID(pUserId: number, pBlogId: number): Promise<Blog> {
        try {
            const tFilters: string[] = ["Id", "author_id"];
            const tParams: SqlParameter[] = [];
            tParams.push(new SqlParameter("Id", pBlogId, mssql.BigInt, false));
            tParams.push(new SqlParameter("author_id", pUserId, mssql.BigInt, false));
            const tSelectStatement = await DatabaseHelper.getSelectStatement(new Blog(), tFilters);
            const tOutput: any[] = [];
            const tExecuteResult = await DatabaseService.executeCommand(tSelectStatement, tParams, tOutput);
            if (tExecuteResult === eResult.Error) {
                Logger.log("Failed to execute get blog by id command");
                return null;
            } else {
                const tBlogs: Blog = tOutput[0] as Blog;
                return tBlogs;
            }
        } catch (error) {
            Logger.log(error);;
        }
    }

    public static async CreateBlog(pBlog: Blog): Promise<eResult> {
        try {
            const tParams: SqlParameter[] = [];
            tParams.push(new SqlParameter("title", pBlog.title, mssql.VarChar, false));
            tParams.push(new SqlParameter("content", pBlog.content, mssql.VarChar, false));
            tParams.push(new SqlParameter("author_id", pBlog.author_Id, mssql.BigInt, false));
            const tInsertStatement = await DatabaseHelper.getInsertStatement(new Blog());
            const tOutput: any[] = [];
            const tExecuteResult = await DatabaseService.executeCommand(tInsertStatement, tParams, tOutput);
            if (tExecuteResult === eResult.Error) {
                Logger.log("Failed to execute create blogs command");
            }
            return tExecuteResult;
        } catch (error) {
            Logger.log(error);
            return eResult.Error;
        }
    }

    public static async DeleteBlog(pBlogId: number, pUserId: number): Promise<eResult> {
        try {
            const tFilters: string[] = ["Id", "author_id"];
            const tParams: SqlParameter[] = [];
            tParams.push(new SqlParameter("Id", pBlogId, mssql.BigInt, false));
            tParams.push(new SqlParameter("author_id", pUserId, mssql.BigInt, false));
            const tDeleteStatement = await DatabaseHelper.getDeleteStatment(new Blog(), tFilters);
            const tOutput: any[] = [];
            const tExecuteResult = await DatabaseService.executeCommand(tDeleteStatement, tParams, tOutput);
            if (tExecuteResult === eResult.Error) {
                Logger.log("Failed to execute delete blogs command");
            }
            return tExecuteResult;
        } catch (error) {
            Logger.log(error);;
            return eResult.Error;
        }
    }

    public static async UpdateBlog(pBlogId: number, pUserId: number, pNewBlog: Blog): Promise<eResult> {
        try {
            const tFilters: string[] = ["Id", "author_id"];
            const tParams: SqlParameter[] = [];
            tParams.push(new SqlParameter("Id", pBlogId, mssql.BigInt, false));
            tParams.push(new SqlParameter("author_id", pUserId, mssql.BigInt, false));
            tParams.push(new SqlParameter("title", pNewBlog.title, mssql.VarChar, false));
            tParams.push(new SqlParameter("content", pNewBlog.content, mssql.VarChar, false));
            const tUpdateStatement = await DatabaseHelper.getUpdateStatement(new Blog(), tFilters);
            const tOutput: any[] = [];
            const tExecuteResult = await DatabaseService.executeCommand(tUpdateStatement, tParams, tOutput);
            if (tExecuteResult === eResult.Error) {
                Logger.log("Failed to execute update blog command");
                return eResult.Error;
            }
            return tExecuteResult;
        } catch (error) {
            Logger.log(error);;
            return eResult.Error;
        }
    }
}