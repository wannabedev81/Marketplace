import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { Router } from "@angular/router";
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from "../services/auth.service";


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor (
        private router: Router,
        private snackbar: MatSnackBar,
        private authService: AuthService
    ) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        
        //not using localStorage and instead relying on HTTP-only cookies (withCredentials: true), no need to touch or add headers inside the interceptor at all.
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === 401) {
                    this.authService.logout();
                    this.snackbar.open('⚠️ Session expired. Please log in again.', 'OK', {
                        duration: 3000
                    });
                    this.router.navigate(['/profiles/login']);
                }
                return throwError(() => error);
            })
        );
    }
}