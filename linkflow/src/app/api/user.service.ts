import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})

export class UserService {
    constructor(){};

    setUserId(userId: string) {
        localStorage.setItem('userId', userId);
    }

    getUserId(): string | null {
        return localStorage.getItem('userId');
    }

    removeUserId(): void {
        localStorage.removeItem('userId');
    }
}