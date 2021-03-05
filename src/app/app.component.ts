import { Component, EventEmitter, Injectable, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AgGridAngular, ICellRendererAngularComp } from 'ag-grid-angular';
import { ColumnApi, GridApi, RowNode } from 'ag-grid-community';
import { BtnCellRenderer } from './grid-btn';
import { UserService } from './user-service';
import User from './user-service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
@Injectable()
export class AppComponent implements OnInit, ICellRendererAngularComp {
  constructor(public userService: UserService) {}
  form: FormGroup;

  @ViewChild('myGrid') myGrid: AgGridAngular


  gridApi: GridApi
  gridColumnApi: ColumnApi;

  myGridApi: GridApi;

  isEditing: boolean = false;

  users

  p: number;

  frameworkComponents = {
    btnCellRenderer: BtnCellRenderer
  }

  refresh

  menuItems = [{title: 'List'}, {title: 'Empty'}]

  columnDefs = [
    {field: 'name', sortable: true, filter: 'agTextColumnFilter', checkboxSelection: 'true'},
    {field: 'surname', filter: 'agTextColumnFilter'},
    {field: 'country'},
    {field: 'city'},
    {headerName: 'date of birth',  field: 'dateOfBirth'},
    {
      field: 'Deletion',
      cellRenderer: 'btnCellRenderer',
      minWidth: 150,
    }
  ];

  

  rowData = this.userService.getUsers();

  params: any;

  

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
   console.log(this.userService.getUsers());
   this.users = this.userService.dataSource;
   console.log('USERS', this.users);
  }

  agInit(params) {
    this.params = params;
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
    this.userService.addUser(newUser);
    this.myGrid.api.setRowData(this.userService.getUsers());
  }

  removeCard(user: User) {
    this.userService.removeUser(user);
    this.gridApi.setRowData(this.userService.getUsers());
    console.log(name);
    console.log(this.userService.getUsers())
  }

  editCard(user: User) {
    this.isEditing = true;
    this.form.get('name').setValue(user.name);
    this.form.get('surname').setValue(user.surname);
    this.form.get('address').get('country').setValue(user.country);
    this.form.get('address').get('city').setValue(user.city);
    this.form.get('address').get('dateOfBirth').setValue(user.dateOfBirth);

    this.userService.detectIndex(user);
  }

  editUser() {
    const editedUser: User = {
      name: this.form.get('name').value,
      surname: this.form.get('surname').value,
      country: this.form.get('address').get('country').value,
      city: this.form.get('address').get('city').value,
      dateOfBirth: this.form.get('address').get('dateOfBirth').value
    }

   this.userService.editUser(editedUser);
    this.isEditing = false;
    this.myGrid.api.setRowData(this.userService.getUsers());
    this.form.reset();

  }

  handlePageChange(event) {
    this.p = event
  }

  getSelectedRows() {
    const selectedMode: RowNode[] = this.myGrid.api.getSelectedNodes();
    const selectedData = selectedMode.map(node => {
      console.log(node.data)
    });
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    console.log(this.gridApi);
    console.log(this.gridColumnApi)

    this.gridApi.setRowData(this.rowData);

    this.myGridApi = params;
    console.log(params)

    console.log('grid ready');
  }
}