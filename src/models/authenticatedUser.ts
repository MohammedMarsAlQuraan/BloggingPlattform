import { Logger } from "../services/logger.service";

export class AuthenticatedUser {
    public id: number = -1
    public username: string = "";
    constructor(pId: number, pUsername: string) {
        this.id = pId;
        this.username = pUsername;
    }

    public isValid(): boolean {
        try {
            const tIsValid = Object.values(this).every(value => {
                if (value !== null) {
                    return true;
                }
                return false;
            });
            return tIsValid;
        } catch (error) {
            Logger.log(error);;
            return false;
        }
    }
}