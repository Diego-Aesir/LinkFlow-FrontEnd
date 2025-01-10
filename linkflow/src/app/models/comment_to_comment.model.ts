export class CommentToComment {
    constructor(
            public commentParentId: string,
            public ownerId: string,
            public text: string,
            public commentsId: string[]          
    ) {};
}