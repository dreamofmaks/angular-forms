import { Component, OnInit, ViewChild } from '@angular/core';
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

  @ViewChild('form') myForm;
  constructor(private readonly userService: UserService, private readonly countryService: CountryService, private readonly router: Router) { }

  ngOnInit(): void {
  }

  edit() {
    let editedCountryId: number;
    this.countryService.value$.value.forEach((country) => {
      if(this.myForm.form.value.address.country === country.name){
        editedCountryId = country.id;
      }
    })
    const editedUser: User = {
      id: this.userService.currentUser$.value.id,
      firstName: this.myForm.form.value.name,
      lastName: this.myForm.form.value.surname,
      dateOfBirth: this.myForm.form.value.address.dateOfBirth,
      addressId: this.userService.currentUser$.value.addressId,
      address: {
        country: {
          id: editedCountryId,
          name: this.myForm.form.value.address.country,
        },
        city: {
          id: this.userService.currentUser$.value.address.cityId,
          name: this.myForm.form.value.address.city,
        },
        street: this.myForm.form.value.address.street,
        building: this.myForm.form.value.address.building
    }
  }
    this.userService.editUser(editedUser).subscribe(() => {
      this.router.navigate(['home']);
    })
    console.log(editedUser);
  }

}
