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

  initSub: Subscription;
  addingSub: Subscription;

  myGridApi: GridApi;

  user: User;

  isEditing: boolean = false;


  frameworkComponents = {
    btnCellRenderer: BtnCellRenderer
  }


  menuItems = [{title: 'List'}, {title: 'Empty'}]

  columnDefs = [
    {field: 'firstName', sortable: true, filter: 'agTextColumnFilter', checkboxSelection: 'true'},
    {field: 'lastName', filter: 'agTextColumnFilter'},
    {field: 'address.country.name', headerName: 'Country'},
    {field: 'address.city.name', headerName: 'City'},
    {field: 'address.street'},
    {field: 'address.building'},
    {headerName: 'date of birth',  field: 'dateOfBirth'},
    {
      field: 'Deletion',
      cellRenderer: 'btnCellRenderer',
      minWidth: 150,
    }
  ];

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
    this.initSub = this.userService.getRequestUser().subscribe(() => {
      this.myGrid.api.setRowData(this.userService.fetchedUsers.getValue());
    });
  }

  Submit(value) {
    if (this.form.valid) {
      this.form.reset();
      this.gridApi.refreshCells();
    }
  }

  addUser() {
    const newUser: User = {
      firstName: this.form.get('name').value,
      lastName: this.form.get('surname').value,
      dateOfBirth: this.form.get('address').get('dateOfBirth').value,
      address: {
        city: {
          name: this.form.get('address').get('city').value
        },
        country: {
          name: this.form.get('address').get('country').value,
        },
        street: this.form.get('address').get('street').value,
        building: this.form.get('address').get('building').value
      }
      
    };
    this.addingSub = this.userService.addUser(newUser).subscribe(() => {
      this.myGrid.api.setRowData(this.userService.fetchedUsers.getValue());
    });
  }

  removeCard(user: User) {
    this.userService.removeUser(user);
    this.gridApi.setRowData(this.userService.fetchedUsers.getValue());
  }

  editCard(user: User) {
    console.log(user);
    this.isEditing = true;
    this.form.get('name').setValue(user.firstName);
    this.form.get('surname').setValue(user.lastName);
    this.form.get('address').get('dateOfBirth').setValue(user.dateOfBirth);
    this.form.get('address').get('country').setValue(user.address.country.name);
    this.form.get('address').get('city').setValue(user.address.city.name);
    this.form.get('address').get('street').setValue(user.address.street);
    this.form.get('address').get('building').setValue(user.address.building);
  }

  editUser() {
    const editedUser: User = {
      firstName: this.form.get('name').value,
      lastName: this.form.get('surname').value,
      dateOfBirth: this.form.get('address').get('dateOfBirth').value,
      address: {
        country: {
          name: this.form.get('address').get('city').value,
        },
        city: {
          name: this.form.get('address').get('country').value,
        },
        street: this.form.get('address').get('street').value,
        building: this.form.get('address').get('building').value
      } 
    }
    this.userService.editUser(editedUser).subscribe(() => {
      this.isEditing = false;
      this.myGrid.api.setRowData(this.userService.fetchedUsers.getValue());
      this.form.reset();
    });
  }

  getSelectedRows(value) {
    const selectedNodes: RowNode[] = this.myGrid.api.getSelectedNodes();
    if (selectedNodes.length = 1) {
      const selectedData = selectedNodes.forEach(node => {
        this.user = { ...node.data }
        console.log(this.user);
        this.isEditing = !this.isEditing;
        this.form.get('name').setValue(this.user.firstName);
        this.form.get('surname').setValue(this.user.lastName);
        this.form.get('address').get('dateOfBirth').setValue(this.user.dateOfBirth);
        this.form.get('address').get('country').setValue(this.user.address.country.name);
        this.form.get('address').get('city').setValue(this.user.address.city.name);
        this.form.get('address').get('street').setValue(this.user.address.street);
        this.form.get('address').get('building').setValue(this.user.address.building)
      });
    } else {
    }
    
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridApi.setRowData(this.userService.fetchedUsers.value);
    this.myGridApi = params;
  }

  ngOnDestroy() {
    this.initSub.unsubscribe();
    this.addingSub.unsubscribe();
  }
}