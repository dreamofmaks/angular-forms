import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AgGridAngular } from 'ag-grid-angular';

export default interface User {
  name: string,
  surname: string,
  country: string,
  city: string
  dateOfBirth: Date
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  form: FormGroup;
  // @Output() onAdd: EventEmitter<User> = new EventEmitter<User>();
  @ViewChild('myGrid') myGrid: AgGridAngular

  users: User[] = [];

  isEditing: boolean = false;

  index: number = 0;

  p: number;

  menuItems = [{title: 'List'}, {title: 'Empty'}]

  columnDefs = [
    {field: 'name', sortable: true, filter: 'agTextColumnFilter'},
    {field: 'surname', filter: 'agTextColumnFilter'},
    {field: 'country'},
    {field: 'city'},
    {name: 'date of birth',  field: 'dateOfBirth'}
  ];



  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(4)]),
      surname: new FormControl('', [Validators.required, Validators.minLength(4)]),
      address: new FormGroup({
        country: new FormControl('ua'),
        city: new FormControl('', Validators.required),
        dateOfBirth: new FormControl('', []),
      })
    });
    this.myGrid.rowData = this.users;
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
      city: this.form.get('address').get('city').value,
      dateOfBirth: this.form.get('address').get('dateOfBirth').value
    };
    this.users.unshift(newUser);
    console.log(this.users);
    this.myGrid.api.setRowData(this.users);
    
  }

  removeCard(name: string) {
    this.users = this.users.filter(u => u.name !== name);
    this.myGrid.api.setRowData(this.users);
  }

  editCard(user: User) {
    console.log(user);
    this.isEditing = true;
    this.form.get('name').setValue(user.name);
    this.form.get('surname').setValue(user.surname);
    this.form.get('address').get('country').setValue(user.country);
    this.form.get('address').get('city').setValue(user.city);
    this.form.get('address').get('dateOfBirth').setValue(user.dateOfBirth);

    this.index = this.users.indexOf(user);
  }

  editUser() {
    const editedUser: User = {
      name: this.form.get('name').value,
      surname: this.form.get('surname').value,
      country: this.form.get('address').get('country').value,
      city: this.form.get('address').get('city').value,
      dateOfBirth: this.form.get('address').get('dateOfBirth').value
    }

    if (this.index !== -1) {
      this.users[this.index] = editedUser;
    }
    this.isEditing = false;
    this.myGrid.api.setRowData(this.users);
    this.form.reset();

  }

  handlePageChange(event) {
    this.p = event
  }
}
