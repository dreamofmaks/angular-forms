import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  @ViewChild('form') myForm;
  constructor(private readonly authService: AuthService, private readonly router: Router) { }

  ngOnInit(): void {
  }
  logIn() {
    this.authService.logIn(this.myForm.form.value.email, this.myForm.form.value.password).subscribe(() => {
      this.router.navigate(['home'])
    })
  }
}
