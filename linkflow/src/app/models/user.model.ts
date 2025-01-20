export class User {
    constructor(
        public userName: string = '',
        public name: string = '',
        public userEmail: string = '',
        public pronoun: string = '',
        public password: string = '',
        public profile: string = '',
        public gender: string = '',
        public photo: File | null = null,
        public isGoogle: string = 'false'
    ){};
}