import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CountryService } from '../services/country-service';
import User from '../models/user-model';
import { UserService } from '../services/user-service';

@Component({
  selector: 'app-form',
  templateUrl: './edit-form.component.html',
  styleUrls: ['./edit-form.component.scss']
})
export class EditFormComponent implements OnInit {

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
      address: new FormGroup({
        country: new FormControl('ua'),
        city: new FormControl('', Validators.required),
        dateOfBirth: new FormControl('', []),
        street: new FormControl('', [Validators.required]),
        building: new FormControl('', [Validators.required])
      })
    });

    this.route.queryParams.subscribe((params) => {
      if (params.id !== undefined) {
        this.getUser(Number.parseInt(params.id));
      }
    })
  }

  Submit(value) {
    if (this.form.valid) {
      this.form.reset();
    }
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
}
