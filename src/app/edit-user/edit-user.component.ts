import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import User from '../models/user-model';
import { CountryService } from '../services/country-service';
import { UserService } from '../services/user-service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {

  constructor(private readonly route: ActivatedRoute,
              private readonly userService: UserService, 
              private readonly countryService: CountryService,
              private readonly router: Router) { }

  form: FormGroup;
  countries$ = this.countryService.getCountries();

  ngOnInit(): void {
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

    this.route.queryParams.subscribe((params) => {
      if(params !== undefined) {
        this.pathUserToForm(Number.parseInt(params.id))
      }
    })
  }

  pathUserToForm(id: number) {
    this.userService.getUserById(id).subscribe((user: User) => {
      this.form.patchValue({
        name: user.firstName,
        surname: user.lastName,
        address: {
          country: user.address.country.id,
          city: user.address.city.name,
          dateOfBirth: new Date(user.dateOfBirth),
          street: user.address.street,
          building: user.address.building
        }
      })
    })
  }

  editUser() {
    let editedCountryId: number;
    this.countryService.value$.value.forEach((country) => {
      if(this.form.get('address.country').value === country.id){
        editedCountryId = country.id;
      }
    })
    const user: User = {
      id: this.userService.currentUser$.value.id,
      firstName: this.form.get('name').value,
      lastName : this.form.get('surname').value,
      dateOfBirth: this.form.get('address.dateOfBirth').value,
      addressId: this.userService.currentUser$.value.addressId,
      address: {
        city: {
          id: this.userService.currentUser$.value.address.city.id,
          name: this.form.get('address.city').value
        },
        country: {
          id: editedCountryId,
          name: this.userService.currentUser$.value.address.country.name
        },
        building: this.form.get('address.building').value,
        street: this.form.get('address.street').value
      }
    }
    this.userService.editUser(user).subscribe(() => {
      this.router.navigate(['home']);
    })
  }

}
