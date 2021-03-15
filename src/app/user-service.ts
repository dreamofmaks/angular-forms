import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { map, switchMap } from 'rxjs/operators';
import { HttpClient } from "@angular/common/http"

export interface Country {
    name: string,
}

export interface City {
    name: string
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
    address: Address
    // country: string,
    // city: string
    // street: string,
    // building: number
  }

@Injectable({providedIn: 'root'})
export class UserService{
    private users: User[] = [];

    idCounter = 10;

    readonly fetchedUsers = new BehaviorSubject<User[]>(this.users);

    constructor(private http: HttpClient) {}

    index: number;

    getRequestUser(): Observable<any> {
        return this.http.get('https://localhost:44303/api/user').pipe(
            map(val => {
                this.users = this.users.concat(val as User);
                this.fetchedUsers.next(val as User[]);
            })
        );
        
    }
    addUser(user: User): Observable<any> {
        user.id = ++this.idCounter
        return this.http.post('https://localhost:44303/api/user', user).pipe(
            map((val: User) => {
                this.users = this.users.concat(val as User)
                this.fetchedUsers.next(this.users);
            })
        );
    }

    removeUser(user: User): Observable<any> {
        return this.http.delete(`https://localhost:44303/api/user/${user.id}`).pipe(
            map((data) => {
                this.removeById(this.users, user.id);
                this.fetchedUsers.next(this.users);
            })
        );
    }

    editUser(editedUser: User): Observable<any> {
        // const userIndx = this.users.findIndex(user => user.id === editedUser.id);
        // this.users[userIndx] = editedUser;
        // this.fetchedUsers.next(this.users);
        return this.http.put(`https://localhost:44303/api/user/${editedUser.id}`, editedUser).pipe(

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

