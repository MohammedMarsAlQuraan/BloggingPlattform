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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const blog_1 = require("../models/blog");
const blog_service_1 = require("../services/blog.service");
const authentication_1 = require("../middlewares/authentication");
const authenticatedUser_1 = require("../models/authenticatedUser");
const body_parser_1 = __importDefault(require("body-parser"));
const enums_1 = require("../common/enums");
const logger_service_1 = require("../services/logger.service");
const CommonMethod_1 = require("../common/CommonMethod");
const ResponseResult_1 = require("../models/ResponseResult");
class BlogRoutes {
    static initializeRoutes() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.router.get('/', authentication_1.authenticateTokenMiddleware, this.getAllBlogs);
                this.router.get('/:id', authentication_1.authenticateTokenMiddleware, this.getBlogById);
                this.router.post('/', authentication_1.authenticateTokenMiddleware, body_parser_1.default.json(), this.createBlog);
                this.router.put('/:id', authentication_1.authenticateTokenMiddleware, body_parser_1.default.json(), this.updateBlog);
                this.router.delete('/:id', authentication_1.authenticateTokenMiddleware, this.deleteBlog);
            }
            catch (error) {
                logger_service_1.Logger.log(error);
                ;
            }
        });
    }
    static getAllBlogs(req, res) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { orderByDirection, orderby, offset, limit } = req.query;
                const tAuthUser = ((_a = res.locals) === null || _a === void 0 ? void 0 : _a.user) ? (_b = res.locals) === null || _b === void 0 ? void 0 : _b.user : null;
                if (!tAuthUser) {
                    res.status(401).json(new ResponseResult_1.ResponseResult(enums_1.eResult.Error, 'Not Authenticated', null));
                    return;
                }
                let tOrderByDirection;
                let tOrderby = orderby ? orderby.toString() : '';
                if (orderByDirection) {
                    if (orderByDirection.toString().toLowerCase() === 'asc') {
                        tOrderByDirection = enums_1.OrderByDirection.Asc;
                    }
                    else if (orderByDirection.toString().toLowerCase() === 'desc') {
                        tOrderByDirection = enums_1.OrderByDirection.Desc;
                    }
                }
                let tOffset = -1;
                let tLimit = -1;
                if (offset != undefined && limit != undefined) {
                    tOffset = parseInt(offset.toString());
                    tLimit = parseInt(limit.toString());
                }
                const tAuthinticatedUser = new authenticatedUser_1.AuthenticatedUser(tAuthUser.id, tAuthUser.username);
                const tBlogs = yield blog_service_1.BlogService.GetAllBlogs(tAuthinticatedUser.id, tOrderby, tOrderByDirection, tOffset, tLimit);
                if (tBlogs) {
                    res.json(new ResponseResult_1.ResponseResult(enums_1.eResult.Success, '', tBlogs));
                    return;
                }
                else {
                    res.json(new ResponseResult_1.ResponseResult(enums_1.eResult.Error, 'There is no item found', null));
                    return;
                }
            }
            catch (error) {
                logger_service_1.Logger.log(error);
                ;
                res.status(500).json(new ResponseResult_1.ResponseResult(enums_1.eResult.Error, error, null));
                return;
            }
        });
    }
    static getBlogById(req, res) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tAuthUser = ((_a = res.locals) === null || _a === void 0 ? void 0 : _a.user) ? (_b = res.locals) === null || _b === void 0 ? void 0 : _b.user : null;
                if (!tAuthUser) {
                    res.status(401).json(new ResponseResult_1.ResponseResult(enums_1.eResult.Error, 'Not Authenticated', null));
                    return;
                }
                const tAuthinticatedUser = new authenticatedUser_1.AuthenticatedUser(tAuthUser.id, tAuthUser.username);
                const blogId = parseInt(req.params.id);
                const tBlog = yield blog_service_1.BlogService.GetBlogByID(tAuthinticatedUser.id, blogId);
                if (tBlog) {
                    res.json(new ResponseResult_1.ResponseResult(enums_1.eResult.Success, '', tBlog));
                    return;
                }
                else {
                    res.json(new ResponseResult_1.ResponseResult(enums_1.eResult.Error, 'Item not found', null));
                    return;
                }
            }
            catch (error) {
                logger_service_1.Logger.log(error);
                res.status(500).json(new ResponseResult_1.ResponseResult(enums_1.eResult.Error, error, null));
                return;
            }
        });
    }
    static createBlog(req, res) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tAuthUser = ((_a = res.locals) === null || _a === void 0 ? void 0 : _a.user) ? (_b = res.locals) === null || _b === void 0 ? void 0 : _b.user : null;
                if (!tAuthUser) {
                    res.status(401).json(new ResponseResult_1.ResponseResult(enums_1.eResult.Error, 'Not Authenticated', null));
                    return;
                }
                const tAuthinticatedUser = new authenticatedUser_1.AuthenticatedUser(tAuthUser.id, tAuthUser.username);
                const tBody = req.body;
                if (!tBody || CommonMethod_1.CommonMethod.isStringEmptyOrUndefiend(tBody.title)) {
                    res.status(500).json(new ResponseResult_1.ResponseResult(enums_1.eResult.Error, 'The title should be filled', null));
                    return;
                }
                if (!tBody || CommonMethod_1.CommonMethod.isStringEmptyOrUndefiend(tBody.content)) {
                    res.status(500).json(new ResponseResult_1.ResponseResult(enums_1.eResult.Error, 'The content should be filled', null));
                    return;
                }
                const tBlog = new blog_1.Blog(tBody.title, tBody.content, tAuthinticatedUser.id);
                const tResult = yield blog_service_1.BlogService.CreateBlog(tBlog);
                if (tResult === enums_1.eResult.Success) {
                    res.json(new ResponseResult_1.ResponseResult(enums_1.eResult.Success, 'Create a new blog', tBlog));
                    return;
                }
                else {
                    res.json(new ResponseResult_1.ResponseResult(tResult, 'Blog not created successfully', null));
                    return;
                }
            }
            catch (error) {
                logger_service_1.Logger.log(error);
                res.status(500).json(new ResponseResult_1.ResponseResult(enums_1.eResult.Error, error, null));
                return;
            }
        });
    }
    static updateBlog(req, res) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tAuthUser = ((_a = res.locals) === null || _a === void 0 ? void 0 : _a.user) ? (_b = res.locals) === null || _b === void 0 ? void 0 : _b.user : null;
                if (!tAuthUser) {
                    res.status(401).json(new ResponseResult_1.ResponseResult(enums_1.eResult.Error, 'Not Authenticated', null));
                    return;
                }
                const tAuthinticatedUser = new authenticatedUser_1.AuthenticatedUser(tAuthUser.id, tAuthUser.username);
                const tBody = req.body;
                if (!tBody || CommonMethod_1.CommonMethod.isStringEmptyOrUndefiend(tBody.title)) {
                    res.json(new ResponseResult_1.ResponseResult(enums_1.eResult.Error, 'The title should be filled', null));
                    return;
                }
                if (!tBody || CommonMethod_1.CommonMethod.isStringEmptyOrUndefiend(tBody.content)) {
                    res.json(new ResponseResult_1.ResponseResult(enums_1.eResult.Error, 'The content should be filled', null));
                    return;
                }
                const tBlog = new blog_1.Blog(tBody.title, tBody.content, tAuthinticatedUser.id);
                const tBlogId = parseInt(req.params.id);
                const tResult = yield blog_service_1.BlogService.UpdateBlog(tBlogId, tAuthinticatedUser.id, tBlog);
                if (tResult === enums_1.eResult.Success) {
                    res.json(new ResponseResult_1.ResponseResult(tResult, `Blog with ID (${tBlogId}) Updated`, null));
                    return;
                }
                else if (tResult === enums_1.eResult.Error) {
                    res.json(new ResponseResult_1.ResponseResult(tResult, `Faild to update blog with ID (${tBlogId})`, null));
                    return;
                }
                else {
                    res.json(new ResponseResult_1.ResponseResult(tResult, `The Blog Not Found`, null));
                    return;
                }
            }
            catch (error) {
                logger_service_1.Logger.log(error);
                res.status(500).json(new ResponseResult_1.ResponseResult(enums_1.eResult.Error, error, null));
                return;
            }
        });
    }
    static deleteBlog(req, res) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tAuthUser = ((_a = res.locals) === null || _a === void 0 ? void 0 : _a.user) ? (_b = res.locals) === null || _b === void 0 ? void 0 : _b.user : null;
                if (!tAuthUser) {
                    res.status(401).json(new ResponseResult_1.ResponseResult(enums_1.eResult.Error, 'Not Authenticated', null));
                    return;
                }
                const tAuthinticatedUser = new authenticatedUser_1.AuthenticatedUser(tAuthUser.id, tAuthUser.username);
                const tBlogId = parseInt(req.params.id);
                const tResult = yield blog_service_1.BlogService.DeleteBlog(tBlogId, tAuthinticatedUser.id);
                if (tResult === enums_1.eResult.Success) {
                    res.json(new ResponseResult_1.ResponseResult(tResult, `Blog with ID (${tBlogId}) Deleted`, null));
                    return;
                }
                else if (tResult === enums_1.eResult.Error) {
                    res.json(new ResponseResult_1.ResponseResult(tResult, `Faild to delete blog with ID (${tBlogId})`, null));
                    return;
                }
                else {
                    res.status(401).json(new ResponseResult_1.ResponseResult(tResult, 'NOT Authorized', null));
                    return;
                }
            }
            catch (error) {
                logger_service_1.Logger.log(error);
                res.status(500).json(new ResponseResult_1.ResponseResult(enums_1.eResult.Error, error, null));
                return;
            }
        });
    }
    static getRouter() {
        return this.router;
    }
}
BlogRoutes.router = express_1.default.Router();
exports.default = BlogRoutes;
