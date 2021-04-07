import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import User from '../models/user-model';
import { CountryService } from '../services/country-service';
import { UserService } from '../services/user-service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

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
      email: new FormControl('', [Validators.required, Validators.email]),
      address: new FormGroup({
        country: new FormControl('ua'),
        city: new FormControl('', Validators.required),
        dateOfBirth: new FormControl('', []),
        street: new FormControl('', [Validators.required]),
        building: new FormControl('', [Validators.required])
      })
    });
  }

  addUser() {
    const user: User = {
      firstName: this.form.get('name').value,
      lastName: this.form.get('surname').value,
      dateOfBirth: this.form.get('address.dateOfBirth').value,
      email: this.form.get('email').value,
      address: {
        building: this.form.get('address.building').value,
        street: this.form.get('address.street').value,
        country: {
          id: this.form.get('address.country').value,
          name: this.form.get('address.country').value
        },
        city: {
          name: this.form.get('address.city').value
        }
      }
    }
    this.userService.addUser(user).subscribe(() => {
      this.router.navigate(['home']);
    })
  }
}
