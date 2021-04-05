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
         NbCardModule,
         NbUserModule } from '@nebular/theme';

import { AppComponent } from './app.component';
import { Routes, RouterModule } from '@angular/router';

import { AgGridModule } from 'ag-grid-angular'
import { BtnCellRenderer } from './user-grid/grid-btn';
import { HttpClientModule } from '@angular/common/http';
import { UserGridComponent } from './user-grid/user-grid.component';
import { JwtModule } from '@auth0/angular-jwt';
import { AuthGuard } from './guards/auth-guard';
import { LoginComponent } from './login/login.component'

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth-interceptor';
import { SignupComponent } from './signup/signup.component';
import { EditUserComponent } from './edit-user/edit-user.component';

const routes: Routes = [
  {path: '', component: LoginComponent, pathMatch: 'full'},
  {path: 'home', component: UserGridComponent, canActivate: [AuthGuard]},
  {path: 'userform', component: EditUserComponent, canActivate: [AuthGuard]},
  {path: 'signUp', component: SignupComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    BtnCellRenderer,
    UserGridComponent,
    LoginComponent,
    SignupComponent,
    EditUserComponent,
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
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          return localStorage.getItem("JWT");
        },
        allowedDomains: ["localhost:44303"],
        disallowedRoutes: ["localhost:44303/api/auth"]
      }
    }),
    NbUserModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
