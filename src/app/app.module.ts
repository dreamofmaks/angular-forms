import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgxPaginationModule } from 'ngx-pagination';
import { NbThemeModule,  NbSidebarModule, NbLayoutModule, NbButtonModule, NbInputModule, NbSelectModule, NbDatepickerModule, NbContextMenuModule, NbMenuModule } from '@nebular/theme';

import { AppComponent } from './app.component';
import { UserCardComponent } from './user-card/user-card.component';
import { Routes, RouterModule } from '@angular/router';

import { AgGridModule } from 'ag-grid-angular'

const routes: Routes = [
  // {path: '', component: AppComponent},
  // {path: 'list', component: ListComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    UserCardComponent,
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    NbThemeModule.forRoot({ name: 'cosmic' }),
    NbSidebarModule.forRoot(),
    NbLayoutModule,
    NbButtonModule,
    NbInputModule,
    NbSelectModule,
    NbDatepickerModule.forRoot(),
    NbMenuModule.forRoot(),
    NbContextMenuModule,
    AgGridModule.withComponents([])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
