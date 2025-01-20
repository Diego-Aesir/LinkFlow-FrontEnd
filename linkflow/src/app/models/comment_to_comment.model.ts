export class CommentToComment {
    constructor(
            public commentParentId: string | null='',
            public ownerId: string | null='',
            public text: string | null='',
            public commentsId: string[] | []          
    ) {};
}