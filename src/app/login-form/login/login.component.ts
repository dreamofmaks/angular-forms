import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  valid: boolean;
  data: any;

  constructor(private readonly authService: AuthService, private readonly router: Router, private formBuilder: FormBuilder) { }
  ngOnInit(): void {
  }
  logIn() {
    this.authService.logIn(this.data.email, this.data.password).subscribe(() => {
      this.router.navigate(['home']);
    })
  }

  isFormValid(){
    if(this.valid) {
      return true;
    } else {
      return false;
    }
  }

  getLoginData(value) {
    this.data = value;
  }
}
