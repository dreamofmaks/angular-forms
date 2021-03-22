import { ChangeDetectionStrategy, Component, Inject, Injectable, LOCALE_ID, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AgGridAngular } from 'ag-grid-angular';
import { RowNode } from 'ag-grid-community';
import { BtnCellRenderer } from './grid-btn';
import {  UserService } from './user-service';
import User from './models/user-model';
import { Subscription } from 'rxjs';
import { CountryService } from './country-service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
@Injectable()
export class AppComponent implements OnInit, OnDestroy {
  constructor(public userService: UserService,
              public CountryService: CountryService, 
              @Inject(LOCALE_ID) private locale: string) {}

  form: FormGroup;

  @ViewChild('myGrid') myGrid: AgGridAngular

  initSub: Subscription;
  addingSub: Subscription;

  user: User;

  isEditing: boolean = false;

  frameworkComponents = {
    btnCellRenderer: BtnCellRenderer
  }

  columnDefs = [
    {field: 'firstName', sortable: true, filter: 'agTextColumnFilter', checkboxSelection: 'true'},
    {field: 'lastName', filter: 'agTextColumnFilter'},
    {field: 'address.country.name', headerName: 'Country'},
    {field: 'address.city.name', headerName: 'City',},
    {field: 'address.street', headerName: 'Street'},
    {field: 'address.building', headerName: 'building'},
    {headerName: 'date of birth',  field: 'dateOfBirth', cellRenderer: data => {
      return formatDate(data.value, 'dd MMM yyyy', this.locale)
    }},
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
    this.initSub = this.userService.getAllUsers().subscribe((value) => {
      this.myGrid.api.setRowData(value);
    });

    this.CountryService.getCountries().subscribe();
  }

  ngOnDestroy() {
    this.initSub.unsubscribe();
    this.addingSub.unsubscribe();
  }

  Submit(value) {
    if (this.form.valid) {
      this.form.reset();
      this.myGrid.api.refreshCells();
    }
  }

  addUser() {
    let currentCountryId;
    this.CountryService.value$.value.forEach((country) => {
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
      this.myGrid.api.setRowData(this.userService.fetchedUsers.value);
    });
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
    this.userService.editUser(editedUser).subscribe((value) => {
      this.isEditing = false;
      this.myGrid.api.setRowData(this.userService.fetchedUsers.value);
      this.form.reset();
    });
  }

  getSelectedUser(value) {
    const selectedNodes: RowNode[] = this.myGrid.api.getSelectedNodes();
    if (selectedNodes.length = 1) {
        selectedNodes.forEach(node => {
        this.user = { ...node.data };
        this.isEditing = !this.isEditing;
        this.form.get('name').setValue(this.user.firstName);
        this.form.get('surname').setValue(this.user.lastName);
        this.form.get('address').get('dateOfBirth').setValue(this.user.dateOfBirth);
        this.form.get('address').get('country').setValue(this.user.address.country.name);
        this.form.get('address').get('city').setValue(this.user.address.city.name);
        this.form.get('address').get('street').setValue(this.user.address.street);
        this.form.get('address').get('building').setValue(this.user.address.building)
      });
    }
  }

  onGridReady(params) {
    this.myGrid.api.setRowData(this.userService.fetchedUsers.value);
  }
}