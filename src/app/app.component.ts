import { ChangeDetectionStrategy, Component, Injectable, OnInit } from '@angular/core';
import { NbMenuService } from '@nebular/theme';
import { Router } from '@angular/router';
import { AuthService } from './services/auth-service';
import User from './models/user-model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
@Injectable()
export class AppComponent {
  constructor(private readonly menuService: NbMenuService,
              private readonly router: Router,
              private readonly authService: AuthService) {
      this.menuService.onItemClick().subscribe((val) => {
        this.router.navigate([val.item.link])
      })
  }
  items = [
    {title: 'Home', link: 'home'},
    {title: 'New User', link: 'signUp'}
  ];

  currentUser: User;

  public get isLoggedIn() {
    return this.authService.isAuthenticated();
  }

  logOut() {
    this.authService.logOut();
    this.router.navigate(['']);
  }

  signUp() {
    this.router.navigate(['signUp']);
  }
}