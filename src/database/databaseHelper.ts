
import { type } from 'os';
import { Constants } from '../common/Constant';
import { OrderByDirection } from '../common/enums';
import { SqlParameter } from './models/sqlParameter';
import * as mssql from 'mssql';
import { Dictionary } from './models/dictionary';
import { KeyValue } from './models/keyValue';
import { Logger } from '../services/logger.service';

export class DatabaseHelper<T> {
  private static table_Prefix = 'T_';
  // tslint:disable member-ordering
  public static getSelectStatement<T>(pEntity: T, pFilters?: string[], pOrderBy?: string, pOrderDirection?: OrderByDirection, pOffset: number = -1, pLimit: number = -1): string {
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
        tOrderByClause = this.getOrderByClause(pOrderBy, (pOrderDirection === undefined ? OrderByDirection.Asc : pOrderDirection));
        if (pOffset !== -1 && pLimit !== -1) {
          tOffsetClause = this.getOffsetClause(pOffset, pLimit);
        }
      }
      const tSelectStatement: string = `${Constants.SELECT} ${tAttributesStr} ${Constants.FROM} ${tTableName} ${tWhereClause} ${tOrderByClause} ${tOffsetClause}`;
      return tSelectStatement;
    } catch (error) {
      Logger.log(error);
      return '';
    }
  }

  public static getUpdateStatement<T>(pEntity: T, pFilters?: string[]): string {
    try {
      const tTableName = DatabaseHelper.getTableName(pEntity);
      const tAttributes = DatabaseHelper.getEntityAttributesWithoutNonSQL(pEntity);
      const tUpdatePairs = tAttributes.map(attr => `${attr} = @${attr}`).join(',');
      let tWhereClause = '';
      if (pFilters && pFilters.length > 0) {
        tWhereClause = this.getWhereClause(pFilters);
      }
      const tUpdateStatement: string = `${Constants.UPDATE} ${tTableName} ${Constants.SET} ${tUpdatePairs} ${tWhereClause}`;
      return tUpdateStatement;
    } catch (error) {
      Logger.log(error);
      return '';
    }
  }

  public static getInsertStatement<T>(pEntity: T): string {
    try {
      const tTableName = DatabaseHelper.getTableName(pEntity);
      const tAttributes = DatabaseHelper.getEntityAttributesWithoutID(pEntity);
      const tColumnNames = tAttributes.join(',');
      const tParamNames = tAttributes.map(attr => `@${attr}`).join(',');
      const tInsertStatement: string = `${Constants.INSERT} ${tTableName} (${tColumnNames}) ${Constants.VALUES} (${tParamNames})`;
      return tInsertStatement;
    } catch (error) {
      Logger.log(error);
      return '';
    }
  }

  public static getDeleteStatment<T>(pEntity: T, pFilters?: string[]): string {
    try {
      const tTableName = DatabaseHelper.getTableName(pEntity);
      let tWhereClause = '';
      if (pFilters && pFilters.length > 0) {
        tWhereClause = this.getWhereClause(pFilters);
      }
      const tSelectStatement: string = `${Constants.DELETE}  ${Constants.FROM} ${tTableName} ${tWhereClause}`;
      return tSelectStatement;
    } catch (error) {
      Logger.log(error);
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
  public static getEntityAttributes<T>(pEntity: T): string[] {
    try {
      let tAttributes = Object.getOwnPropertyNames(pEntity);
      tAttributes = tAttributes.filter((value) => !value.startsWith('_'));
      tAttributes = tAttributes.map((value) => `[${value}]`);
      return tAttributes;
    } catch (error) {
      Logger.log(error);
      return [];
    }
  }

  public static getEntityAttributesWithoutNonSQL<T>(pEntity: T): string[] {
    try {
      let tAttributes = Object.getOwnPropertyNames(pEntity);
      tAttributes = tAttributes.filter((value) => !value.startsWith('_'));
      tAttributes = tAttributes.map((value) => `${value}`);
      return tAttributes;
    } catch (error) {
      Logger.log(error);
      return [];
    }
  }

  public static getEntityAttributesWithoutID<T>(pEntity: T): string[] {
    try {
      let tAttributes = Object.getOwnPropertyNames(pEntity);
      tAttributes = tAttributes.filter((value) => value != 'id' && !value.startsWith("_"));
      tAttributes = tAttributes.map((value) => `${value}`);
      return tAttributes;
    } catch (error) {
      Logger.log(error);
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
  public static getParameters(pKeyTypeDictionary: Dictionary<string>, pParams: KeyValue[]): SqlParameter[] {
    try {
      const tDBParams: any = pParams.map((element) => {
        if (element.value !== '-1') {

          const [tIsOut, tParamType] = this.getDBType(pKeyTypeDictionary, element.key);
          return new SqlParameter(element.key, element.value, tParamType, tIsOut);
        }
      },
      );
      return tDBParams;
    } catch (error) {
      Logger.log(error);
      return [];
    }
  }

  /**
   * @static
   * @summary gets the the mssql type of the provided key
   * @param {string} pKey - the column name
   * @returns {mssql.ISqlTypeFactoryWithNoParams} - mssql type
   */
  public static getDBType(pKeyTypeDictionary: Dictionary<string>, pKey: string): [boolean, mssql.ISqlTypeFactoryWithNoParams] {
    try {
      let tIsOut: boolean = false;
      if (pKeyTypeDictionary.containsKey(pKey)) {
        const tKeyValue = pKeyTypeDictionary.getItem(pKey).split(',');
        if (tKeyValue.length === 2) {
          tIsOut = tKeyValue[1] === 'out';
        }
        return [tIsOut, mssql[tKeyValue[0]]];
      }
      return [tIsOut, mssql.NVarChar];
    } catch (error) {
      Logger.log(error);
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
  public static getOrderByClause(pColumnName: string, pOrderDirection: OrderByDirection): string {
    try {
      let tOrderByClause: string = '';
      let tOrderDirectionString = Constants.ASC;
      if (pOrderDirection === OrderByDirection.Desc) {
        tOrderDirectionString = Constants.DESC;
      }
      tOrderByClause = `${Constants.ORDERBY} [${pColumnName}] ${tOrderDirectionString}`;
      return tOrderByClause;
    } catch (error) {
      Logger.log(error);
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
  public static getOffsetClause(pOffset: number, pLimit: number): string {
    try {
      let tOffsetClause: string = '';
      tOffsetClause = `${Constants.OFFSET} ${pOffset} ${Constants.ROWS} ${Constants.FETCH} ${Constants.NEXT} ${pLimit} ${Constants.ROWS} ${Constants.ONLY}`;
      return tOffsetClause;
    } catch (error) {
      Logger.log(error);
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
  public static getTableName<T>(pEntity: T): string {
    try {
      const tTableName: string = this.table_Prefix + pEntity.constructor.name;
      return tTableName;
    } catch (error) {
      Logger.log(error);
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
  public static getWhereClause(pFilters: string[]): string {
    try {
      let tSqlCondition: string = '';

      if (pFilters && pFilters.length > 0) {
        pFilters.forEach((element) => {
          tSqlCondition += `${element} = @${element} ${Constants.AND} `;
        });
        tSqlCondition = `${Constants.WHERE} ${tSqlCondition.substring(0, tSqlCondition.lastIndexOf(Constants.AND)).trim()}`;
      }
      return tSqlCondition;
    } catch (error) {
      Logger.log(error);
      return "";
    }
  }

}
