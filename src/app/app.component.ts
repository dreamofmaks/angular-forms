import { ChangeDetectionStrategy, Component, Inject, Injectable, LOCALE_ID, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AgGridAngular } from 'ag-grid-angular';
import { RowNode } from 'ag-grid-community';
import { BtnCellRenderer } from './grid-btn';
import {  UserService } from './user-service';
import User from './models/user-model';
import { Subscription } from 'rxjs';
import { CountryService } from './country-service';
import { formatDate } from '@angular/common';
import { NbMenuService } from '@nebular/theme';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
@Injectable()
export class AppComponent implements OnInit, OnDestroy {
  constructor(private readonly userService: UserService,
    private readonly countryService: CountryService,
    private readonly menuService: NbMenuService,
    private readonly router: Router) {
      menuService.onItemClick().subscribe((val) => {
        this.router.navigate([val.item.link])
      })
  }
  items = [
    {title: 'Home', link: ''},
    {title: 'Form', link: 'userform'}
  ];



  ngOnInit() {
  }

  ngOnDestroy() {
  }
}