export class Posts {
    constructor(
        public title: string = '',
        public text: string = '',
        public photo: File | null = null,
        public tags: string[] = [],
        public ownerId: string = ''
    ) {}
}