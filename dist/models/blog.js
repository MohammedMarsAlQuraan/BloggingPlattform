"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blog = void 0;
class Blog {
    constructor(pTitle = "", pContent = "", pAuthorId = -1) {
        this._id = -1;
        this.title = pTitle;
        this.content = pContent;
        this.author_Id = pAuthorId;
    }
}
exports.Blog = Blog;
