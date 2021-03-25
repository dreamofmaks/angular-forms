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
import { Routes, RouterModule } from '@angular/router';

import { AgGridModule } from 'ag-grid-angular'
import { BtnCellRenderer } from './user-grid/grid-btn';
import { HttpClientModule } from '@angular/common/http';
import { UserGridComponent } from './user-grid/user-grid.component';
import { FormComponent } from './form/form.component';

const routes: Routes = [
  {path: '', component: UserGridComponent, pathMatch: 'full'},
  {path: 'userform', component: FormComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    BtnCellRenderer,
    UserGridComponent,
    FormComponent,
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    FormsModule,
    HttpClientModule,
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
    NbCardModule,
  ],

  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
