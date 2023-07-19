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
exports.BlogService = void 0;
const enums_1 = require("../common/enums");
const databaseHelper_1 = require("../database/databaseHelper");
const databaseService_1 = require("../database/databaseService");
const sqlParameter_1 = require("../database/models/sqlParameter");
const blog_1 = require("../models/blog");
const mssql = __importStar(require("mssql"));
const logger_service_1 = require("./logger.service");
class BlogService {
    static GetAllBlogs(pUserId, pOrderBy, pOrderByDirection, pOffset = -1, pLimit = -1) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tFilters = ["Author_Id"];
                const tParams = [];
                tParams.push(new sqlParameter_1.SqlParameter("Author_Id", pUserId, mssql.BigInt, false));
                const tSelectStatement = yield databaseHelper_1.DatabaseHelper.getSelectStatement(new blog_1.Blog(), tFilters, pOrderBy, pOrderByDirection, pOffset, pLimit);
                const tOutput = [];
                const tExecuteResult = yield databaseService_1.DatabaseService.executeCommand(tSelectStatement, tParams, tOutput);
                if (tExecuteResult === enums_1.eResult.Error) {
                    logger_service_1.Logger.log("Failed to execute get blogs command");
                    return [];
                }
                else {
                    const tBlogs = tOutput;
                    return tBlogs;
                }
            }
            catch (error) {
                logger_service_1.Logger.log(error);
                ;
            }
        });
    }
    static GetBlogByID(pUserId, pBlogId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tFilters = ["Id", "author_id"];
                const tParams = [];
                tParams.push(new sqlParameter_1.SqlParameter("Id", pBlogId, mssql.BigInt, false));
                tParams.push(new sqlParameter_1.SqlParameter("author_id", pUserId, mssql.BigInt, false));
                const tSelectStatement = yield databaseHelper_1.DatabaseHelper.getSelectStatement(new blog_1.Blog(), tFilters);
                const tOutput = [];
                const tExecuteResult = yield databaseService_1.DatabaseService.executeCommand(tSelectStatement, tParams, tOutput);
                if (tExecuteResult === enums_1.eResult.Error) {
                    logger_service_1.Logger.log("Failed to execute get blog by id command");
                    return null;
                }
                else {
                    const tBlogs = tOutput[0];
                    return tBlogs;
                }
            }
            catch (error) {
                logger_service_1.Logger.log(error);
                ;
            }
        });
    }
    static CreateBlog(pBlog) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tParams = [];
                tParams.push(new sqlParameter_1.SqlParameter("title", pBlog.title, mssql.VarChar, false));
                tParams.push(new sqlParameter_1.SqlParameter("content", pBlog.content, mssql.VarChar, false));
                tParams.push(new sqlParameter_1.SqlParameter("author_id", pBlog.author_Id, mssql.BigInt, false));
                const tInsertStatement = yield databaseHelper_1.DatabaseHelper.getInsertStatement(new blog_1.Blog());
                const tOutput = [];
                const tExecuteResult = yield databaseService_1.DatabaseService.executeCommand(tInsertStatement, tParams, tOutput);
                if (tExecuteResult === enums_1.eResult.Error) {
                    logger_service_1.Logger.log("Failed to execute create blogs command");
                }
                return tExecuteResult;
            }
            catch (error) {
                logger_service_1.Logger.log(error);
                return enums_1.eResult.Error;
            }
        });
    }
    static DeleteBlog(pBlogId, pUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tFilters = ["Id", "author_id"];
                const tParams = [];
                tParams.push(new sqlParameter_1.SqlParameter("Id", pBlogId, mssql.BigInt, false));
                tParams.push(new sqlParameter_1.SqlParameter("author_id", pUserId, mssql.BigInt, false));
                const tDeleteStatement = yield databaseHelper_1.DatabaseHelper.getDeleteStatment(new blog_1.Blog(), tFilters);
                const tOutput = [];
                const tExecuteResult = yield databaseService_1.DatabaseService.executeCommand(tDeleteStatement, tParams, tOutput);
                if (tExecuteResult === enums_1.eResult.Error) {
                    logger_service_1.Logger.log("Failed to execute delete blogs command");
                }
                return tExecuteResult;
            }
            catch (error) {
                logger_service_1.Logger.log(error);
                ;
                return enums_1.eResult.Error;
            }
        });
    }
    static UpdateBlog(pBlogId, pUserId, pNewBlog) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tFilters = ["Id", "author_id"];
                const tParams = [];
                tParams.push(new sqlParameter_1.SqlParameter("Id", pBlogId, mssql.BigInt, false));
                tParams.push(new sqlParameter_1.SqlParameter("author_id", pUserId, mssql.BigInt, false));
                tParams.push(new sqlParameter_1.SqlParameter("title", pNewBlog.title, mssql.VarChar, false));
                tParams.push(new sqlParameter_1.SqlParameter("content", pNewBlog.content, mssql.VarChar, false));
                const tUpdateStatement = yield databaseHelper_1.DatabaseHelper.getUpdateStatement(new blog_1.Blog(), tFilters);
                const tOutput = [];
                const tExecuteResult = yield databaseService_1.DatabaseService.executeCommand(tUpdateStatement, tParams, tOutput);
                if (tExecuteResult === enums_1.eResult.Error) {
                    logger_service_1.Logger.log("Failed to execute update blog command");
                    return enums_1.eResult.Error;
                }
                return tExecuteResult;
            }
            catch (error) {
                logger_service_1.Logger.log(error);
                ;
                return enums_1.eResult.Error;
            }
        });
    }
}
exports.BlogService = BlogService;
