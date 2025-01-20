import { HttpInterceptorFn } from "@angular/common/http";
import { AuthService } from "./auth.service";

export const authInterceptor : HttpInterceptorFn = (req, next) =>{
    const auth = new AuthService;    
    const token = auth.getToken();

    if(token) {
        const authReq = req.clone({headers: req.headers.set('Authorization', `Bearer ${token}`)});
        return next(authReq);
    } else {
        return next(req);    
    }
}