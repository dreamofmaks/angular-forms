import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private readonly authService: AuthService, private readonly router: Router) { }

  ngOnInit(): void {
  }

  logIn(email: string, password: string){
    this.authService.logIn(email, password).subscribe(() => {
      this.router.navigate(['home']);
    },
    (err) => alert("Wrong email or password!"))
  }

  signUp() {
    this.router.navigate(['userform']);
  }
}
