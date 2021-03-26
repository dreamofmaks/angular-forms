import { Route } from '@angular/compiler/src/core';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CountryService } from '../services/country-service';
import User from '../models/user-model';
import { UserService } from '../services/user-service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {

  constructor(private readonly countryService: CountryService, 
              private readonly userService: UserService, 
              private route: ActivatedRoute, 
              private readonly router: Router) {
    
  }

  form: FormGroup;

  isEditing: boolean = true;

  readonly countries$ = this.countryService.getCountries();

  addingSub: Subscription;

  user: User

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(4)]),
      surname: new FormControl('', [Validators.required, Validators.minLength(4)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
      address: new FormGroup({
        country: new FormControl('ua'),
        city: new FormControl('', Validators.required),
        dateOfBirth: new FormControl('', []),
        street: new FormControl('', [Validators.required]),
        building: new FormControl('', [Validators.required])
      })
    });

      this.route.queryParams.subscribe((params) => {
        if(params.id !== undefined){
          this.getUser(Number.parseInt(params.id));
        }
      })
  }

  Submit(value) {
    if (this.form.valid) {
      this.form.reset();
    }
  }

  addUser() {
    let currentCountryId;
    this.countryService.value$.value.forEach((country) => {
      if(this.form.get('address').get('country').value === country.name) {
        currentCountryId = country.id
      }
    })
    const newUser: User = {
      firstName: this.form.get('name').value,
      lastName: this.form.get('surname').value,
      dateOfBirth: this.form.get('address').get('dateOfBirth').value,
      email: this.form.get('email').value,
      password: this.form.get('password').value,
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
      this.router.navigate(['home']);
    });
  }

  getUser(id: number) {
    this.userService.getUserById(id).subscribe((value: User) => {
      this.form.patchValue({
          name: value.firstName,
          surname: value.lastName,
          address: {
            country: value.address.country.name,
            city: value.address.city.name,
            building: value.address.building,
            street: value.address.street,
            dateOfBirth: new Date(value.dateOfBirth)
          } 
        });
      })
    }

    editUser() {
      let editedCountryId: number;
      this.countryService.value$.value.forEach((country) => {
        if(this.form.get('address').get('country').value === country.name){
          editedCountryId = country.id;
        }
      })
      const editedUser: User = {
        id: this.userService.currentUser$.value.id,
        firstName: this.form.get('name').value,
        lastName: this.form.get('surname').value,
        dateOfBirth: this.form.get('address').get('dateOfBirth').value,
        addressId: this.userService.currentUser$.value.addressId,
        address: {
          country: {
            id: editedCountryId,
            name: this.form.get('address').get('country').value,
          },
          city: {
            id: this.userService.currentUser$.value.address.cityId,
            name: this.form.get('address').get('city').value,
          },
          street: this.form.get('address').get('street').value,
          building: this.form.get('address').get('building').value
        } 
      }
      this.userService.editUser(editedUser).subscribe(() => {
        this.router.navigate(['home']);
      });
    }
}
