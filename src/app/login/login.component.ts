import { HttpErrorResponse } from '@angular/common/http';
import { Component, ContentChild, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NbComponentStatus, NbDialogService, NbToastrService } from '@nebular/theme';
import { AuthService } from '../services/auth-service';
 
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private readonly authService: AuthService,
              private readonly router: Router, 
              private readonly dialogService: NbDialogService,
              private toastrService: NbToastrService) {
   
   }
  form: FormGroup;
  @ViewChild('dialog') popup;
  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required])
    })
  }

  Submit() {
    this.form.reset();
  }

  logIn(email, password, status) {
    this.authService.logIn(email, password).subscribe(() => {
      this.router.navigate(['home']);
    },
    (err: HttpErrorResponse) => {
      console.log(err);
      this.toastrService.show("Wrong email or password", "Warning", status);
    })
  }
}
