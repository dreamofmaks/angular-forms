import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import User from 'src/app/models/user-model';
import { CountryService } from 'src/app/services/country-service';
import { UserService } from 'src/app/services/user-service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  constructor(private readonly userService: UserService, private readonly countryService: CountryService, private readonly router: Router) { }
  valid: boolean;
  ngOnInit(): void {
  }

  data: any;

  edit() {
    let editedCountryId: number;
    this.countryService.value$.value.forEach((country) => {
      if(this.data.address.country === country.id){
        editedCountryId = country.id;
      }
    })
    const editedUser: User = {
      id: this.userService.currentUser$.value.id,
      firstName: this.data.name,
      lastName: this.data.surname,
      dateOfBirth: this.data.address.dateOfBirth,
      addressId: this.userService.currentUser$.value.addressId,
      address: {
        country: {
          id: editedCountryId,
          name: null,
        },
        city: {
          id: this.userService.currentUser$.value.address.cityId,
          name: this.data.address.city,
        },
        street: this.data.address.street,
        building:  this.data.address.street
    }
  }
    this.userService.editUser(editedUser).subscribe(() => {
      this.router.navigate(['home']);
    })
    console.log(editedUser)
  }

  getFormValue(value) {
    this.data = value;
    console.log('DATA', this.data);
  }

  Submit(form) {
  }
}
