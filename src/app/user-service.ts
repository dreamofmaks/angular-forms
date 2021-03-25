import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Url } from '../environments/environment';
import User from "./models/user-model";

@Injectable({providedIn: 'root'})
export class UserService{

    readonly fetchedUsers = new BehaviorSubject<User[]>([]);
    readonly currentUser$ = new BehaviorSubject<User>(null)

    constructor(private readonly http: HttpClient) {}

    getAllUsers(): Observable<any> {
        return this.http.get(Url).pipe(
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

    addUser(user: User): Observable<any> {
        return this.http.post(Url, user).pipe(
            tap((val: User) => {
                this.fetchedUsers.next(this.fetchedUsers.value.concat(val));
            })
        );
    }

    removeUser(user: User): Observable<any> {
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
}

