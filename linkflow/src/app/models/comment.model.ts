export class Comment {
    constructor(
            public postId: string,
            public ownerId: string,
            public text: string,
            public commentsId: string[] | null
    ) {}
}