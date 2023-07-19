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
exports.App = void 0;
const express_1 = __importDefault(require("express"));
const blog_1 = __importDefault(require("./routes/blog"));
const user_1 = __importDefault(require("./routes/user"));
const databaseService_1 = require("./database/databaseService");
const logger_service_1 = require("./services/logger.service");
class App {
    static InitializeApp() {
        return __awaiter(this, void 0, void 0, function* () {
            const app = (0, express_1.default)();
            const port = process.env.PORT || 3000;
            yield databaseService_1.DatabaseService.start();
            blog_1.default.initializeRoutes();
            user_1.default.initializeRoutes();
            app.use('/blogs', blog_1.default.getRouter());
            app.use('/auth', user_1.default.getRouter());
            app.get('/', (req, res) => {
                res.send('Express + TypeScript Server');
            });
            app.listen(port, () => {
                logger_service_1.Logger.log(`⚡️[server]: Server is running at http://localhost:${port}`);
                console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
            });
        });
    }
}
exports.App = App;
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield App.InitializeApp();
}))();
