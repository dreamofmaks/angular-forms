import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import User from '../models/user-model';
import { AuthService } from '../services/auth-service';
import { CountryService } from '../services/country-service';
import { UserService } from '../services/user-service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  constructor(private readonly countryService: CountryService, 
              private readonly userService: UserService, 
              private readonly router: Router,
              private readonly authService: AuthService) { }
  form: FormGroup;
  readonly countries$ = this.countryService.getCountries();

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(4)]),
      surname: new FormControl('', [Validators.required, Validators.minLength(4)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', []),
      address: new FormGroup({
        country: new FormControl('ua'),
        city: new FormControl('', Validators.required),
        dateOfBirth: new FormControl('', []),
        street: new FormControl('', [Validators.required]),
        building: new FormControl('', [Validators.required])
      })
    })
  }

  addUser() {
    let currentCountryId;
    this.countryService.value$.value.forEach((country) => {
      if (this.form.get('address.country').value === country.name) {
        currentCountryId = country.id
      }
    })
    const user: User = {
      firstName: this.form.get('name').value,
      lastName: this.form.get('surname').value,
      email: this.form.get('email').value,
      password: {
        password: this.form.get('password').value
      },
      dateOfBirth: this.form.get('address.dateOfBirth').value,
      address: {
        city: {
          name: this.form.get('address.city').value
        },
        country: {
          id: currentCountryId,
          name: this.form.get('address.country').value
        },
        building: this.form.get('address.building').value,
        street: this.form.get('address.street').value,
      }
    }
    this.userService.signUpUser(user).subscribe(() => {
      this.authService.logIn(user.email, user.password.password).subscribe(() => {
        this.router.navigate(['home'])
      })
    })
  }
}
