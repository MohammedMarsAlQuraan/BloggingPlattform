import { eResult } from "../common/enums";

export class ResponseResult {
    public result: eResult;
    public message: string;
    public data: any;

    constructor(pResult: eResult, pMessage: string, pData: any) {
        this.result = pResult;
        this.message = pMessage;
        this.data = pData;
    }
}