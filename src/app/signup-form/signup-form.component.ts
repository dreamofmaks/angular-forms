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



  constructor(private readonly countryService: CountryService, private readonly userService: UserService, private readonly router: Router) { }

  data: any;

  ngOnInit(): void {
  }

  addUser() {
    let currentCountryId;
    this.countryService.value$.value.forEach((country) => {
      if (this.data.address.country === country.id) {
        currentCountryId = country.id
      }
    })

    const user: User = {
      firstName: this.data.name,
      lastName: this.data.surname,
      dateOfBirth: this.data.address.dateOfBirth,
      email: this.data.email,
      password: {
        password: this.data.password,
      },
      address: {
        city: {
          name: this.data.address.city
        },
        country: {
          id: currentCountryId,
          name: "",
        },
        street:this.data.address.street,
        building: this.data.address.building
      }
    }
      this.userService.addUser(user).subscribe(() => {
        this.router.navigate(['home']);
      })
    console.log(this.data);
  }

  getUserData(value) {
    this.data = {...this.data, ...value};
  }

  getUserLoginData(value) {
    this.data = {...this.data, ...value};
  }
}
