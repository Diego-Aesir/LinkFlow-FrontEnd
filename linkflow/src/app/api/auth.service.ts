import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    constructor() {}

    setToken(jwt: string) {
        localStorage.setItem("jwt", jwt);
    }

    getToken(): string | null {
        return localStorage.getItem("jwt");
    }

    removeToken(): void {
        localStorage.removeItem("jwt");
    }
}