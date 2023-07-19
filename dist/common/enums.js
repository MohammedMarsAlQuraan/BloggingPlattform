"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBConnectionStatus = exports.OrderByDirection = exports.SQLErrors = exports.eResult = void 0;
var eResult;
(function (eResult) {
    eResult[eResult["Success"] = 0] = "Success";
    eResult[eResult["Error"] = -1] = "Error";
    eResult[eResult["NotFound"] = -100] = "NotFound";
})(eResult || (exports.eResult = eResult = {}));
var SQLErrors;
(function (SQLErrors) {
    SQLErrors["Login"] = "ELOGIN";
    SQLErrors["Timeout"] = "ETIMEOUT";
    SQLErrors["ALReadyConnected"] = "EALREADYCONNECTED";
    SQLErrors["ALReadyConnecting"] = "EALREADYCONNECTING";
    SQLErrors["InstLookup"] = "EINSTLOOKUP";
    SQLErrors["Socket"] = "ESOCKET";
})(SQLErrors || (exports.SQLErrors = SQLErrors = {}));
var OrderByDirection;
(function (OrderByDirection) {
    OrderByDirection[OrderByDirection["Asc"] = 0] = "Asc";
    OrderByDirection[OrderByDirection["Desc"] = 1] = "Desc";
})(OrderByDirection || (exports.OrderByDirection = OrderByDirection = {}));
var DBConnectionStatus;
(function (DBConnectionStatus) {
    DBConnectionStatus[DBConnectionStatus["Connected"] = 1] = "Connected";
    DBConnectionStatus[DBConnectionStatus["Disconnected"] = 0] = "Disconnected";
    DBConnectionStatus[DBConnectionStatus["Connecting"] = 2] = "Connecting";
})(DBConnectionStatus || (exports.DBConnectionStatus = DBConnectionStatus = {}));
