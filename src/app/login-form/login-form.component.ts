import { Content } from '@angular/compiler/src/render3/r3_ast';
import { Component, OnInit, Output, EventEmitter, OnChanges, SimpleChanges, ContentChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth-service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {

  @Output() loginData = new EventEmitter();
  form: FormGroup

  constructor(private readonly authService: AuthService, private readonly router: Router) {
   
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl(null, [Validators.required])
    });

    this.form.valueChanges.subscribe(() => {
      this.loginData.emit(this.form.value);
    })
  }

  Submit() {
    
  }

}
