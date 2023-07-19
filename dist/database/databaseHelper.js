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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseHelper = void 0;
const Constant_1 = require("../common/Constant");
const enums_1 = require("../common/enums");
const sqlParameter_1 = require("./models/sqlParameter");
const mssql = __importStar(require("mssql"));
const logger_service_1 = require("../services/logger.service");
class DatabaseHelper {
    // tslint:disable member-ordering
    static getSelectStatement(pEntity, pFilters, pOrderBy, pOrderDirection, pOffset = -1, pLimit = -1) {
        try {
            const tTableName = DatabaseHelper.getTableName(pEntity);
            const tAttributes = DatabaseHelper.getEntityAttributes(pEntity);
            const tAttributesStr = tAttributes.join(',');
            let tWhereClause = '';
            let tOrderByClause = '';
            let tOffsetClause = '';
            if (pFilters && pFilters.length > 0) {
                tWhereClause = this.getWhereClause(pFilters);
            }
            if (pOrderBy !== undefined && pOrderBy !== null && pOrderBy.length > 0) {
                tOrderByClause = this.getOrderByClause(pOrderBy, (pOrderDirection === undefined ? enums_1.OrderByDirection.Asc : pOrderDirection));
                if (pOffset !== -1 && pLimit !== -1) {
                    tOffsetClause = this.getOffsetClause(pOffset, pLimit);
                }
            }
            const tSelectStatement = `${Constant_1.Constants.SELECT} ${tAttributesStr} ${Constant_1.Constants.FROM} ${tTableName} ${tWhereClause} ${tOrderByClause} ${tOffsetClause}`;
            return tSelectStatement;
        }
        catch (error) {
            logger_service_1.Logger.log(error);
            return '';
        }
    }
    static getUpdateStatement(pEntity, pFilters) {
        try {
            const tTableName = DatabaseHelper.getTableName(pEntity);
            const tAttributes = DatabaseHelper.getEntityAttributesWithoutNonSQL(pEntity);
            const tUpdatePairs = tAttributes.map(attr => `${attr} = @${attr}`).join(',');
            let tWhereClause = '';
            if (pFilters && pFilters.length > 0) {
                tWhereClause = this.getWhereClause(pFilters);
            }
            const tUpdateStatement = `${Constant_1.Constants.UPDATE} ${tTableName} ${Constant_1.Constants.SET} ${tUpdatePairs} ${tWhereClause}`;
            return tUpdateStatement;
        }
        catch (error) {
            logger_service_1.Logger.log(error);
            return '';
        }
    }
    static getInsertStatement(pEntity) {
        try {
            const tTableName = DatabaseHelper.getTableName(pEntity);
            const tAttributes = DatabaseHelper.getEntityAttributesWithoutID(pEntity);
            const tColumnNames = tAttributes.join(',');
            const tParamNames = tAttributes.map(attr => `@${attr}`).join(',');
            const tInsertStatement = `${Constant_1.Constants.INSERT} ${tTableName} (${tColumnNames}) ${Constant_1.Constants.VALUES} (${tParamNames})`;
            return tInsertStatement;
        }
        catch (error) {
            logger_service_1.Logger.log(error);
            return '';
        }
    }
    static getDeleteStatment(pEntity, pFilters) {
        try {
            const tTableName = DatabaseHelper.getTableName(pEntity);
            let tWhereClause = '';
            if (pFilters && pFilters.length > 0) {
                tWhereClause = this.getWhereClause(pFilters);
            }
            const tSelectStatement = `${Constant_1.Constants.DELETE}  ${Constant_1.Constants.FROM} ${tTableName} ${tWhereClause}`;
            return tSelectStatement;
        }
        catch (error) {
            logger_service_1.Logger.log(error);
            return '';
        }
    }
    /**
     * @async
     * @static
     * @summary extract the attribute names of an entity.
     * @param {T} pEntity - the entity object you want its properties name.
     * @returns {Promise<string>} - attribute as CSV wrapped in a promise.
     */
    static getEntityAttributes(pEntity) {
        try {
            let tAttributes = Object.getOwnPropertyNames(pEntity);
            tAttributes = tAttributes.filter((value) => !value.startsWith('_'));
            tAttributes = tAttributes.map((value) => `[${value}]`);
            return tAttributes;
        }
        catch (error) {
            logger_service_1.Logger.log(error);
            return [];
        }
    }
    static getEntityAttributesWithoutNonSQL(pEntity) {
        try {
            let tAttributes = Object.getOwnPropertyNames(pEntity);
            tAttributes = tAttributes.filter((value) => !value.startsWith('_'));
            tAttributes = tAttributes.map((value) => `${value}`);
            return tAttributes;
        }
        catch (error) {
            logger_service_1.Logger.log(error);
            return [];
        }
    }
    static getEntityAttributesWithoutID(pEntity) {
        try {
            let tAttributes = Object.getOwnPropertyNames(pEntity);
            tAttributes = tAttributes.filter((value) => value != 'id' && !value.startsWith("_"));
            tAttributes = tAttributes.map((value) => `${value}`);
            return tAttributes;
        }
        catch (error) {
            logger_service_1.Logger.log(error);
            return [];
        }
    }
    /**
     * @async
     * @static
     * @summary returns the data base paramters for the provided parameters
     * @param {Array<KeyValue>} pParams - the parameter you want to convert to DBParameters
     * @returns {Promise<DBParameters[]>} - array of DBParameters wrapped in a promise.
     */
    static getParameters(pKeyTypeDictionary, pParams) {
        try {
            const tDBParams = pParams.map((element) => {
                if (element.value !== '-1') {
                    const [tIsOut, tParamType] = this.getDBType(pKeyTypeDictionary, element.key);
                    return new sqlParameter_1.SqlParameter(element.key, element.value, tParamType, tIsOut);
                }
            });
            return tDBParams;
        }
        catch (error) {
            logger_service_1.Logger.log(error);
            return [];
        }
    }
    /**
     * @static
     * @summary gets the the mssql type of the provided key
     * @param {string} pKey - the column name
     * @returns {mssql.ISqlTypeFactoryWithNoParams} - mssql type
     */
    static getDBType(pKeyTypeDictionary, pKey) {
        try {
            let tIsOut = false;
            if (pKeyTypeDictionary.containsKey(pKey)) {
                const tKeyValue = pKeyTypeDictionary.getItem(pKey).split(',');
                if (tKeyValue.length === 2) {
                    tIsOut = tKeyValue[1] === 'out';
                }
                return [tIsOut, mssql[tKeyValue[0]]];
            }
            return [tIsOut, mssql.NVarChar];
        }
        catch (error) {
            logger_service_1.Logger.log(error);
            return null;
        }
    }
    /**
     * @public
     * @static
     * @summary - gets the orderby column name and direction and add it to the query
     * @param {string} pColumnName - orderby column as string
     * @param {OrderByDirection} pOrderDirection - the orderby direction
     * @returns {string} - the query contains the Order By
     */
    static getOrderByClause(pColumnName, pOrderDirection) {
        try {
            let tOrderByClause = '';
            let tOrderDirectionString = Constant_1.Constants.ASC;
            if (pOrderDirection === enums_1.OrderByDirection.Desc) {
                tOrderDirectionString = Constant_1.Constants.DESC;
            }
            tOrderByClause = `${Constant_1.Constants.ORDERBY} [${pColumnName}] ${tOrderDirectionString}`;
            return tOrderByClause;
        }
        catch (error) {
            logger_service_1.Logger.log(error);
            return '';
        }
    }
    /**
   * @public
   * @static
   * @summary - gets the orderby column name and direction and add it to the query
   * @param {string} pColumnName - orderby column as string
   * @param {OrderByDirection} pOrderDirection - the orderby direction
   * @returns {string} - the query contains the Order By
   */
    static getOffsetClause(pOffset, pLimit) {
        try {
            let tOffsetClause = '';
            tOffsetClause = `${Constant_1.Constants.OFFSET} ${pOffset} ${Constant_1.Constants.ROWS} ${Constant_1.Constants.FETCH} ${Constant_1.Constants.NEXT} ${pLimit} ${Constant_1.Constants.ROWS} ${Constant_1.Constants.ONLY}`;
            return tOffsetClause;
        }
        catch (error) {
            logger_service_1.Logger.log(error);
            return '';
        }
    }
    /**
     * @async
     * @static
     * @summary return the table name of the provided entity
     * @param {any} pEntity - the entity object you want its table name
     * @returns {Promise<string>} - table name as string wrapped in a promise.
     */
    static getTableName(pEntity) {
        try {
            const tTableName = this.table_Prefix + pEntity.constructor.name;
            return tTableName;
        }
        catch (error) {
            logger_service_1.Logger.log(error);
            return null;
        }
    }
    /**
     * @async
     * @static
     * @summary - generate the sql where condition accourding to the provided keys.
     * @param {Array<KeyValue>} pFilters - the keys for the condition.
     * @returns {Promise<string>} - condition string value wrapped in a promise.
     */
    static getWhereClause(pFilters) {
        try {
            let tSqlCondition = '';
            if (pFilters && pFilters.length > 0) {
                pFilters.forEach((element) => {
                    tSqlCondition += `${element} = @${element} ${Constant_1.Constants.AND} `;
                });
                tSqlCondition = `${Constant_1.Constants.WHERE} ${tSqlCondition.substring(0, tSqlCondition.lastIndexOf(Constant_1.Constants.AND)).trim()}`;
            }
            return tSqlCondition;
        }
        catch (error) {
            logger_service_1.Logger.log(error);
            return "";
        }
    }
}
exports.DatabaseHelper = DatabaseHelper;
DatabaseHelper.table_Prefix = 'T_';
