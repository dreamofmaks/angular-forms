import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private readonly authService: AuthService, private readonly router: Router) {
   
   }
  form: FormGroup;

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required])
    })
  }

  Submit() {
    this.form.reset();
  }

  logIn(email, password) {
    this.authService.logIn(email, password).subscribe(() => {
      this.router.navigate(['home']);
    })
  }
}
