import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { tap, retry } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Url, defaultUrl } from '../../environments/environment';
import User from "../models/user-model";

@Injectable({providedIn: 'root'})
export class UserService{

    readonly fetchedUsers = new BehaviorSubject<User[]>([]);
    readonly currentUser$ = new BehaviorSubject<User>(null)
    readonly countOfUsers$ = new BehaviorSubject<number>(null);
    readonly sortedUsers$ = new BehaviorSubject<User[]>(null);

    constructor(private readonly http: HttpClient) {}

    getAllUsers(): Observable<any> {
        return this.http.get(defaultUrl + 'users').pipe(
            tap(val => {
                this.fetchedUsers.next(val);
            })
            
        );
    }

    getUserById(id: number) : Observable<any> {
        return this.http.get(Url + id).pipe(
            tap((val: User) => {
                this.currentUser$.next(val);
            })
        )
    }

    signUpUser(user: User): Observable<any> {
        return this.http.post(Url, user).pipe(
            tap((val: User) => {
                this.fetchedUsers.next(this.fetchedUsers.value.concat(val));
            })
        );
    }

    addUser(user: User) : Observable<any> {
        return this.http.post(Url + 'create', user).pipe(
            tap((val: User) => {
                this.fetchedUsers.next(this.fetchedUsers.value.concat(val));
            })
        )
    }

    removeUser(user: User): Observable<any> {
        console.log(user)
        return this.http.delete(Url + user.id).pipe(
            tap((data) => {
                this.fetchedUsers.next(this.removeById(this.fetchedUsers.value, user.id));
            })
        );
    }

    editUser(editedUser: User): Observable<any> {
        return this.http.put(Url, editedUser).pipe(
            tap((data: User) => {
                const userIndx = this.fetchedUsers.value.findIndex(user => user.id === editedUser.id);
                this.fetchedUsers.value[userIndx] = editedUser; 
                this.fetchedUsers.next(this.fetchedUsers.value);
            })
        )
    }

    removeById(fromItems, id) {
        const index = fromItems.findIndex((element) => {
            return element.id === id;
        });
        if (index >= 0) {
            fromItems.splice(index, 1);
        }
        return fromItems;
    }

    getLimitedUsers(skip, take, sortBy?, order?, pattern?): Observable<any> {
        let params = new HttpParams().append('skip', `${skip}`).append('take', `${take}`);
        if(sortBy) {
            params = params.append('sortBy', `${sortBy}`).append('order', `${order}`);
        }
        if(pattern) {
            params = params.append('searchPattern', `${pattern}`);
        }
        return this.http.get(Url, {params: params});
    }

    getCountOfUsers() : Observable<any> {
        return this.http.get(Url + 'count').pipe(
            tap((value) => {
                this.countOfUsers$.next(value);
            })
        );
    }
}

