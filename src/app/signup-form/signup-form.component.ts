import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import User from '../models/user-model';
import { CountryService } from '../services/country-service';
import { UserService } from '../services/user-service';

@Component({
  selector: 'app-signup-form',
  templateUrl: './signup-form.component.html',
  styleUrls: ['./signup-form.component.scss']
})
export class SignupFormComponent implements OnInit {

  @ViewChild('dataForm') dataForm;
  @ViewChild('credForm') credForm;

  constructor(private readonly countryService: CountryService, private readonly userService: UserService, private readonly router: Router) { }

  ngOnInit(): void {
  }

  addUser() {
    let currentCountryId;
    this.countryService.value$.value.forEach((country) => {
      if (this.dataForm.form.value.address.country === country.name) {
        currentCountryId = country.id
      }
    })

    const user: User = {
      firstName: this.dataForm.form.value.name,
      lastName: this.dataForm.form.value.surname,
      dateOfBirth: this.dataForm.form.value.address.dateOfBirth,
      email: this.credForm.form.value.email,
      password: {
        password1: this.credForm.form.value.password,
      },
      address: {
        city: {
          name: this.dataForm.form.value.address.city
        },
        country: {
          id: currentCountryId,
          name: this.dataForm.form.value.address.country,
        },
        street: this.dataForm.form.value.address.street,
        building: this.dataForm.form.value.address.building
      }
    }

    this.userService.addUser(user).subscribe(() => {
      this.router.navigate(['home']);
    })
  }

}
