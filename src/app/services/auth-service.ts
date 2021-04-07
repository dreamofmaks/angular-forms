import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { authUrl } from '../../environments/environment';
import User from "../models/user-model";
import { JwtHelperService } from '@auth0/angular-jwt';
import { Token } from '../models/token-model';

@Injectable({providedIn: 'root'})
export class AuthService {
    constructor(private readonly http: HttpClient, private jwtHelpper: JwtHelperService) {}

    readonly currentUser$ = new BehaviorSubject<User>(null);

    logIn(email: string, password: string): Observable<any> {
        return this.http.post(authUrl, {email: email, password: password}).pipe(
            tap((token: Token) => {
                localStorage.setItem("JWT", token.token);
            }),
            catchError(this.handleError)
        );
    }

    isAuthenticated(): boolean {
        var token = localStorage.getItem("JWT");
        return token && !this.jwtHelpper.isTokenExpired(token);
    }

    logOut(): void {
        localStorage.removeItem("JWT");
    }

    handleError(error: HttpErrorResponse) {
        return throwError(error);
    }   
}