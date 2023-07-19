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
const user_1 = require("../models/user");
const bcrypt_1 = __importDefault(require("bcrypt"));
const userService_1 = require("../services/userService");
const body_parser_1 = __importDefault(require("body-parser"));
const authenticationService_1 = require("../services/authenticationService");
const logger_service_1 = require("../services/logger.service");
const enums_1 = require("../common/enums");
const ResponseResult_1 = require("../models/ResponseResult");
const CommonMethod_1 = require("../common/CommonMethod");
class UserRoutes {
    static initializeRoutes() {
        return __awaiter(this, void 0, void 0, function* () {
            this.router.post('/login', body_parser_1.default.json(), this.login);
            this.router.post('/register', body_parser_1.default.json(), this.register);
        });
    }
    static getRouter() {
        return this.router;
    }
    static login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tUserName = req.body['Username'];
                const tUser = yield userService_1.UserService.Login(tUserName);
                const tBody = req.body;
                if (!tBody || CommonMethod_1.CommonMethod.isStringEmptyOrUndefiend(tBody.Username)) {
                    res.status(500).json(new ResponseResult_1.ResponseResult(enums_1.eResult.Error, 'The username should be filled', null));
                    return;
                }
                if (!tBody || CommonMethod_1.CommonMethod.isStringEmptyOrUndefiend(tBody.Password)) {
                    res.status(500).json(new ResponseResult_1.ResponseResult(enums_1.eResult.Error, 'The password should be filled', null));
                    return;
                }
                if (tUser) {
                    const tPassword = req.body['Password'];
                    const tIsMatch = bcrypt_1.default.compareSync(tPassword, tUser.password);
                    if (tIsMatch) {
                        const tToken = authenticationService_1.AuthenticationService.generateToken(tUser.id, tUser.username);
                        res.json(new ResponseResult_1.ResponseResult(enums_1.eResult.Success, '', { userId: tUser.id, token: tToken }));
                        return;
                    }
                }
                res.json(new ResponseResult_1.ResponseResult(enums_1.eResult.Success, 'Username or Password is not correct', null));
                return;
            }
            catch (error) {
                logger_service_1.Logger.log(error);
                res.json(new ResponseResult_1.ResponseResult(enums_1.eResult.Error, error, null));
                return;
            }
        });
    }
    static register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tUserName = req.body['Username'];
                const tPassword = yield bcrypt_1.default.hash(req.body['Password'], 8);
                const tUser = new user_1.User(tUserName, tPassword);
                const tBody = req.body;
                if (!tBody || CommonMethod_1.CommonMethod.isStringEmptyOrUndefiend(tBody.Username)) {
                    res.status(500).json(new ResponseResult_1.ResponseResult(enums_1.eResult.Error, 'The username should be filled', null));
                    return;
                }
                if (!tBody || CommonMethod_1.CommonMethod.isStringEmptyOrUndefiend(tBody.Password)) {
                    res.status(500).json(new ResponseResult_1.ResponseResult(enums_1.eResult.Error, 'The password should be filled', null));
                    return;
                }
                const tIsUserExisit = yield userService_1.UserService.isUserExisit(tUserName);
                if (tIsUserExisit) {
                    res.status(500).json(new ResponseResult_1.ResponseResult(enums_1.eResult.Error, 'Username is already exisit', null));
                    return;
                }
                const tResult = yield userService_1.UserService.Register(tUser);
                if (tResult === enums_1.eResult.Success) {
                    res.json(new ResponseResult_1.ResponseResult(tResult, 'User Created Successfully', null));
                    return;
                }
                else {
                    res.json(new ResponseResult_1.ResponseResult(tResult, 'Somthing Went Wrong', null));
                    return;
                }
            }
            catch (error) {
                logger_service_1.Logger.log(error);
                res.json(new ResponseResult_1.ResponseResult(enums_1.eResult.Error, error, null));
                return;
            }
        });
    }
}
UserRoutes.router = express_1.default.Router();
exports.default = UserRoutes;
