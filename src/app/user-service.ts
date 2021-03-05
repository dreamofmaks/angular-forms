import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

export default interface User {
    name: string,
    surname: string,
    country: string,
    city: string
    dateOfBirth: Date
  }

@Injectable({providedIn: 'root'})
export class UserService{
    private users: User[] = [
        {name: 'Maks', surname: 'Leontiev', country: 'Ukraine', city: 'Lviv', dateOfBirth: new Date()}
    ];

    private _dataSource = new BehaviorSubject<User[]>(this.users);

    public readonly dataSource = this._dataSource.asObservable();

    get user() {
        return this._dataSource.asObservable();
    }

    constructor() {
    }

    index: number
    addUser(user: User) {
        this.users.unshift(user);
        this._dataSource.next(this.users);
    }

    detectIndex(user: User) {
        this.index = this.users.indexOf(user)
    }
    removeUser(user: User) {
        this.detectIndex(user);
        this.users.splice(this.index, 1);
        this._dataSource.next(this.users);
    }
    //behaviourSubject

    editUser(editedUser) {
        if (this.index !== -1) {
            this.users[this.index] = editedUser;
        }
        this._dataSource.next(this.users)
    }

    getUsers(): User[] {
        return this._dataSource.getValue();;
    }
}