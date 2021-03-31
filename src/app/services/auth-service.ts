import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { authUrl } from '../../environments/environment';
import User from "../models/user-model";
import { JwtHelperService } from '@auth0/angular-jwt'

@Injectable({providedIn: 'root'})
export class AuthService {
    constructor(private readonly http: HttpClient, private jwtHelpper: JwtHelperService) {}

    readonly currentUser$ = new BehaviorSubject<User>(null);

    logIn(email: string, password: string): Observable<any> {
        return this.http.post(authUrl, {email: email, password: password}).pipe(
            tap((user: User) => {
                this.currentUser$.next(user);
                localStorage.setItem("JWT", user.token);
            })
        );
    }

    isAuthenticated(): boolean {
        var token = localStorage.getItem("JWT");
        return token && !this.jwtHelpper.isTokenExpired(token);
    }

    logOut(): void {
        localStorage.removeItem("JWT");
    }
}