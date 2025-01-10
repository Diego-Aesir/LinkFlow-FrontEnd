export class Posts {
    constructor(
        public title: string,
        public photo: string,
        public tags: string[],
        public ownerId: string
    ) {}
}