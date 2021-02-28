import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

export default interface User {
  name: string,
  surname: string,
  country: string,
  city: string
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  form: FormGroup;
  @Output() onAdd:EventEmitter<User> = new EventEmitter<User>();

  users : User[] = [
    
  ]

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(4)]),
      surname: new FormControl('', [Validators.required, Validators.minLength(4)]),
      address: new FormGroup({
        country: new FormControl('ua'),
        city: new FormControl('', Validators.required)
      })
    });
  }

  Submit() {
    if(this.form.valid) {
      const formData = {...this.form.value};
      console.log("form data:", formData);
      this.form.reset();
    }
  }

  addUser() {
    const newUser: User = {name: this.form.get('name').value, 
                           surname: this.form.get('surname').value, 
                           country: this.form.get('address').get('country').value,
                           city: this.form.get('address').get('city').value};
    this.users.unshift(newUser);
  }
}
