export class User {
    public id: number;
    public username: string;
    public password: string;

    constructor(pUsername = "", pPassword = "") {
        this.id = -1;
        this.username = pUsername;
        this.password = pPassword;
    }
}
