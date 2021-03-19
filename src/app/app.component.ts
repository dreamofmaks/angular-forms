import { ChangeDetectionStrategy, Component, EventEmitter, Injectable, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AgGridAngular, ICellRendererAngularComp } from 'ag-grid-angular';
import { ColumnApi, GridApi, RowNode } from 'ag-grid-community';
import { BtnCellRenderer } from './grid-btn';
import {  UserService } from './user-service';
import User from './models/user-model';
import { Country } from './models/country-model';
import { Subscription } from 'rxjs';
import { CountryService } from './country-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
@Injectable()
export class AppComponent implements OnInit, OnDestroy {
  constructor(public userService: UserService, public CountryService: CountryService) {}
  form: FormGroup;

  @ViewChild('myGrid') myGrid: AgGridAngular


  gridApi: GridApi
  gridColumnApi: ColumnApi;

  initSub: Subscription;
  addingSub: Subscription;

  myGridApi: GridApi;

  user: User;

  countries: Country[];

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
    this.initSub = this.userService.getRequestUser().subscribe((value) => {
      this.myGrid.api.setRowData(value);
    });

    this.CountryService.getCountries().subscribe((value: Country[]) => {
      this.countries = value
    })
  }

  ngOnDestroy() {
    this.initSub.unsubscribe();
    this.addingSub.unsubscribe();
  }

  Submit(value) {
    if (this.form.valid) {
      this.form.reset();
      this.gridApi.refreshCells();
    }
  }

  addUser() {
    let currentCountryId;
    this.countries.forEach((country) => {
      if(this.form.get('address').get('country').value === country.name) {
        currentCountryId = country.id
      }
    })
    const newUser: User = {
      firstName: this.form.get('name').value,
      lastName: this.form.get('surname').value,
      dateOfBirth: this.form.get('address').get('dateOfBirth').value,
      address: {
        city: {
          name: this.form.get('address').get('city').value
        },
        country: {
          id: currentCountryId,
          name: this.form.get('address').get('country').value,
        },
        street: this.form.get('address').get('street').value,
        building: this.form.get('address').get('building').value
      }
      
    };
    this.addingSub = this.userService.addUser(newUser).subscribe(() => {
      this.myGrid.api.setRowData(this.userService.fetchedUsers.getValue());
    });
    console.log(newUser);
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
      id: this.user.id,
      firstName: this.form.get('name').value,
      lastName: this.form.get('surname').value,
      dateOfBirth: this.form.get('address').get('dateOfBirth').value,
      addressid: this.user.addressid,
      address: {
        country: {
          id: this.user.address.countryId,
          name: this.form.get('address').get('country').value,
        },
        city: {
          id: this.user.address.cityId,
          name: this.form.get('address').get('city').value,
        },
        street: this.form.get('address').get('street').value,
        building: this.form.get('address').get('building').value
      } 
    }
    //console.log(editedUser);
    this.userService.editUser(editedUser).subscribe(() => {
      this.isEditing = false;
      this.myGrid.api.setRowData(this.userService.fetchedUsers.getValue());
      this.form.reset();
    });
  }

  getSelectedRows(value) {
    console.log(value);
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
}