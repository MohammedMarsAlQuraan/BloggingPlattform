import { IOptions, IPool} from 'mssql';

export class DatabaseConfiguration {
  public driver?: string;
  public user?: string;
  public password?: string;
  public server: string;
  public port?: number;
  public domain?: string;
  public database: string;
  public connectionTimeout?: number;
  public requestTimeout?: number;
  public stream?: boolean;
  public parseJSON?: boolean;
  public options?: IOptions;
  public pool?: IPool;

  constructor(pUser: string, pPassword: string, pServer: string, pDatabase: string) {
    this.user = pUser;
    this.password = pPassword;
    this.server = pServer;
    this.database = pDatabase;
  }
}
