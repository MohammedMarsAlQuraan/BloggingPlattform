
export class SqlParameter {
    public name: string;
    public value: any;
    public sqltype: any;
    public isOut?: boolean;

    constructor(name: string, value: any, sqlType: any, isOut?: boolean) {
        this.name = name;
        this.value = value;
        this.sqltype = sqlType;
        this.isOut = isOut;
    }
}
