import { NgModule } from '@angular/core';
import { FormsModule, 
         ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgxPaginationModule } from 'ngx-pagination';
import { NbThemeModule,
         NbSidebarModule,  
         NbLayoutModule, 
         NbButtonModule, 
         NbInputModule, 
         NbSelectModule, 
         NbDatepickerModule, 
         NbTreeGridModule, 
         NbContextMenuModule, 
         NbMenuModule,
         NbDialogModule,
         NbCardModule } from '@nebular/theme';

import { AppComponent } from './app.component';
import { UserCardComponent } from './user-card/user-card.component';
import { Routes, RouterModule } from '@angular/router';

import { AgGridModule } from 'ag-grid-angular'
import { BtnCellRenderer } from './grid-btn';

const routes: Routes = [];

@NgModule({
  declarations: [
    AppComponent,
    UserCardComponent,
    BtnCellRenderer,
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
    NbTreeGridModule,
    NbButtonModule,
    NbInputModule,
    NbSelectModule,
    NbDatepickerModule.forRoot(),
    NbMenuModule.forRoot(),
    NbContextMenuModule,
    AgGridModule.withComponents([BtnCellRenderer]),
    NbDialogModule.forRoot(),
    NbCardModule
  ],

  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
