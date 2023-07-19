export class Blog {
    public _id: number;
    public title: string;
    public content: string;
    public author_Id: number;



    constructor(pTitle = "", pContent = "", pAuthorId = -1) {
        this._id = -1;
        this.title = pTitle;
        this.content = pContent;
        this.author_Id = pAuthorId;
    }
}
