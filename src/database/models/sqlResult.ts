import { IRecordSet, IResult} from 'mssql';

export class SQLResult implements IResult<any> {
    public recordsets: Array<IRecordSet<any>>;
    public recordset: IRecordSet<any>;
    public rowsAffected: number[];
    public output: { [key: string]: any; };
}
