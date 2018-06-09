import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AppComponent } from './app.component';
import { SyncHttpService } from './services/sync-http.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { LoginService } from './services/login.service';
import { FileUploadModule } from 'ng2-file-upload';

import { AuthGuardService } from './services/auth-guard.service';
import { AuthGuardChildService } from './services/auth-guard-child.service';
import { AlertService } from './services/alert.service';
import { DataService } from './services/data.service';
import { DaysBetweenTwoDatesService } from './services/days-between-two-dates.service';
import { PostFormDataService } from './services/post-form-data.service';
import { SocketIoService } from './services/socket-io.service';



import { RegisterComponent } from './register/register.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    PasswordResetComponent,
    ForgotPasswordComponent,
    
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule.forRoot(),
    HttpClientModule,
    AppRoutingModule,
    FileUploadModule,
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    SyncHttpService,
    AuthGuardService,
    AuthGuardChildService,
    LoginService,
    AlertService,
    DataService,
    DaysBetweenTwoDatesService,
    PostFormDataService,
    SocketIoService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
