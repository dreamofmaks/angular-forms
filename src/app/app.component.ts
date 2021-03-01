import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

export default interface User {
  name: string,
  surname: string,
  country: string,
  city: string
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  form: FormGroup;
  @Output() onAdd: EventEmitter<User> = new EventEmitter<User>();

  users: User[] = []

  isEditing: boolean = false;

  index: number = 0;

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(4)]),
      surname: new FormControl('', [Validators.required, Validators.minLength(4)]),
      address: new FormGroup({
        country: new FormControl('ua'),
        city: new FormControl('', Validators.required)
      })
    });
  }

  Submit() {
    if (this.form.valid) {
      const formData = { ...this.form.value };
      console.log("form data:", formData);
      this.form.reset();
    }
  }

  addUser() {
    const newUser: User = {
      name: this.form.get('name').value,
      surname: this.form.get('surname').value,
      country: this.form.get('address').get('country').value,
      city: this.form.get('address').get('city').value
    };
    this.users.unshift(newUser);
  }

  removeCard(name: string) {
    console.log(name);
    this.users = this.users.filter(u => u.name !== name);
  }

  editCard(user: User) {
    console.log(user);
    this.isEditing = true;
    this.form.get('name').setValue(user.name);
    this.form.get('surname').setValue(user.surname);
    this.form.get('address').get('country').setValue(user.country);
    this.form.get('address').get('city').setValue(user.city);

    this.index = this.users.indexOf(user);
  }

  editUser() {
    const editedUser: User = {
      name: this.form.get('name').value,
      surname: this.form.get('surname').value,
      country: this.form.get('address').get('country').value,
      city: this.form.get('address').get('city').value
    }

    if (this.index !== -1) {
      this.users[this.index] = editedUser;
    }
    this.isEditing = false;
    this.form.reset();

  }
}

