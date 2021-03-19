import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { map, switchMap, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Url } from '../environments/environment';

export interface Country {
    id?: number,
    name: string,
}

export interface City {
    id?: number,
    name: string,
}

export interface Address {
    id?: number,
    country: Country,
    city: City,
    street: string,
    building: number
}

export default interface User {
    id?: number
    firstName: string,
    lastName: string,
    dateOfBirth: Date,
    addressId?: number,
    address: Address
    // country: string,
    // city: string
    // street: string,
    // building: number
  }

@Injectable({providedIn: 'root'})
export class UserService{
    private users: User[] = [];

    readonly fetchedUsers = new BehaviorSubject<User[]>(this.users);

    constructor(private readonly http: HttpClient) {}

    index: number;

    getRequestUser(): Observable<any> {
        return this.http.get(Url).pipe(
            tap(val => {
                this.users = this.users.concat(val as User);
                this.fetchedUsers.next(val as User[]);
            })
        );
        
    }
    addUser(user: User): Observable<any> {
        return this.http.post(Url, user).pipe(
            tap((val: User) => {
                this.users = this.users.concat(val as User)
                this.fetchedUsers.next(this.users);
            })
        );
    }

    removeUser(user: User): Observable<any> {
        return this.http.delete(Url + user.id).pipe(
            tap((data) => {
                this.removeById(this.users, user.id);
                this.fetchedUsers.next(this.users);
            })
        );
    }

    editUser(editedUser: User): Observable<any> {

        return this.http.put(Url, editedUser).pipe(
            tap((data: User) => {
                const userIndx = this.users.findIndex(user => user.id === editedUser.id);
                this.users[userIndx] = editedUser;
                this.fetchedUsers.next(this.users);
            })
        )
    }



    removeById(fromItems, id) {
        const index = fromItems.findIndex((element) => {
          return element.id === id;
        });
        if (index >= 0 ) {
          fromItems.splice(index, 1);
        }
        return fromItems;
      }

}

