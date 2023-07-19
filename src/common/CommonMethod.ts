export class CommonMethod {

    public static isStringEmptyOrUndefiend(str) {
        return str === null || str === undefined || str.trim() === '';
    }
    
}