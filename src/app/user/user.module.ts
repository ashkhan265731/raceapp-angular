import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EditUsereventsignupComponent } from './edit-usereventsignup/edit-usereventsignup.component';
import { FileuploadComponent } from './fileupload/fileupload.component';
import { FileUploadModule } from 'ng2-file-upload';

import { ListeventComponent } from './listevent/listevent.component';
import { MyEventDetailsComponent } from './my-event-details/my-event-details.component';
import { MyeventsComponent } from './myevents/myevents.component';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';
import { ThankYouComponent } from './thank-you/thank-you.component';
import { UsereventsignupComponent } from './usereventsignup/usereventsignup.component';
import { UserComponent } from './user.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    UserRoutingModule,
    FileUploadModule,

  ],
  declarations: [
    DashboardComponent, 
    EditUsereventsignupComponent, 
    FileuploadComponent, 
    ListeventComponent, 
    MyEventDetailsComponent, 
    MyeventsComponent, 
    ProfileEditComponent, 
    ThankYouComponent, 
    UsereventsignupComponent, 
    UserComponent]
})
export class UserModule { }
