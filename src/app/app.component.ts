import { ChangeDetectionStrategy, Component, EventEmitter, Injectable, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AgGridAngular, ICellRendererAngularComp } from 'ag-grid-angular';
import { ColumnApi, GridApi, RowNode } from 'ag-grid-community';
import { BtnCellRenderer } from './grid-btn';
import { UserService } from './user-service';
import User from './user-service';
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
@Injectable()
export class AppComponent implements OnInit, OnDestroy {
  constructor(public userService: UserService) {}
  form: FormGroup;

  @ViewChild('myGrid') myGrid: AgGridAngular


  gridApi: GridApi
  gridColumnApi: ColumnApi;

  sub: Subscription;

  myGridApi: GridApi;

  user: User;

  isEditing: boolean = false;


  frameworkComponents = {
    btnCellRenderer: BtnCellRenderer
  }


  menuItems = [{title: 'List'}, {title: 'Empty'}]

  columnDefs = [
    {field: 'name', sortable: true, filter: 'agTextColumnFilter', checkboxSelection: 'true'},
    {field: 'surname', filter: 'agTextColumnFilter'},
    {field: 'country'},
    {field: 'city'},
    {field: 'street'},
    {field: 'building'},
    {headerName: 'date of birth',  field: 'dateOfBirth'},
    {
      field: 'Deletion',
      cellRenderer: 'btnCellRenderer',
      minWidth: 150,
    }
  ];

  rowData = this.userService.getUsers();

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(4)]),
      surname: new FormControl('', [Validators.required, Validators.minLength(4)]),
      address: new FormGroup({
        country: new FormControl('ua'),
        city: new FormControl('', Validators.required),
        dateOfBirth: new FormControl('', []),
        street: new FormControl('', [Validators.required]),
        building: new FormControl('', [Validators.required])
      })
    });
    this.sub = this.userService.value$.subscribe(() => {
      
    })
  }

  Submit(value) {
    if (this.form.valid) {
      const formData = { ...value };
      this.form.reset();
      this.gridApi.refreshCells();
    }
  }

  addUser() {
    const newUser: User = {
      name: this.form.get('name').value,
      surname: this.form.get('surname').value,
      country: this.form.get('address').get('country').value,
      city: this.form.get('address').get('city').value,
      dateOfBirth: this.form.get('address').get('dateOfBirth').value,
      street: this.form.get('address').get('street').value,
      building: this.form.get('address').get('building').value
    };
    this.userService.addUser(newUser);
    this.myGrid.api.setRowData(this.userService.getUsers());
  }

  removeCard(user: User) {
    this.userService.removeUser(user);
    this.gridApi.setRowData(this.userService.getUsers());
  }

  editCard(user: User) {
    this.isEditing = true;
    this.form.get('name').setValue(user.name);
    this.form.get('surname').setValue(user.surname);
    this.form.get('address').get('country').setValue(user.country);
    this.form.get('address').get('city').setValue(user.city);
    this.form.get('address').get('dateOfBirth').setValue(user.dateOfBirth);
    this.form.get('address').get('street').setValue(user.street);
    this.form.get('address').get('building').setValue(user.building);
  }

  editUser() {
    const editedUser: User = {
      id: this.user.id,
      name: this.form.get('name').value,
      surname: this.form.get('surname').value,
      country: this.form.get('address').get('country').value,
      city: this.form.get('address').get('city').value,
      dateOfBirth: this.form.get('address').get('dateOfBirth').value,
      street: this.form.get('address').get('street').value,
      building: this.form.get('address').get('building').value
    }
    this.userService.editUser(editedUser);
    this.isEditing = false;
    this.myGrid.api.setRowData(this.userService.getUsers());
    this.form.reset();

  }

  getSelectedRows(value) {
    const selectedNodes: RowNode[] = this.myGrid.api.getSelectedNodes();
    if(selectedNodes.length = 1){
      const selectedData = selectedNodes.forEach(node => {
        this.user = {...node.data}
        this.isEditing = !this.isEditing;
        this.form.get('name').setValue(this.user.name);
        this.form.get('surname').setValue(this.user.surname);
        this.form.get('address').get('country').setValue(this.user.country);
        this.form.get('address').get('city').setValue(this.user.city);
        this.form.get('address').get('dateOfBirth').setValue(this.user.dateOfBirth);
        this.form.get('address').get('street').setValue(this.user.street);
        this.form.get('address').get('building').setValue(this.user.building)
        });
    } else {
    }
    
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridApi.setRowData(this.rowData);
    this.myGridApi = params;
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}