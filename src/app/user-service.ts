import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

export default interface User {
    id?: number
    name: string,
    surname: string,
    country: string,
    city: string
    dateOfBirth: Date,
    street: string,
    building: number
  }

@Injectable({providedIn: 'root'})
export class UserService{
    private readonly users: User[] = [
        // {id: 1, name: 'Maks', surname: 'Leontiev', country: 'Ukraine', city: 'Lviv', dateOfBirth: new Date()}
    ];

    idCounter = 0;

    private readonly _dataSource = new BehaviorSubject<User[]>(this.users);

    readonly value$ = this._dataSource.asObservable();

    constructor() {}

    index: number
    addUser(user: User) {
        user.id = ++this.idCounter
        this.users.unshift(user);
        this._dataSource.next(this.users);
    }

    removeUser(user: User) {
        const index = this.users.findIndex(u => u.id === user.id);
        this.users.splice(index, 1);
        this._dataSource.next(this.users);
    }

    editUser(editedUser: User) {
        const userIndx = this.users.findIndex(user => user.id === editedUser.id);
        this.users[userIndx] = editedUser;
        this._dataSource.next(this.users);
    }

    getUsers(): User[] {
        return this._dataSource.value;
    }
}