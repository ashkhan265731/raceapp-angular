import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProducerRoutingModule } from './producer-routing.module';
import { EventsComponent } from './events/events.component';
import { ListeventsComponent } from './listevents/listevents.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EventDetailsComponent } from './event-details/event-details.component';
import { EditUserEventDetailsComponent } from './edit-user-event-details/edit-user-event-details.component';
import { EditUsereventsignupComponent } from './edit-usereventsignup/edit-usereventsignup.component';
import { FileuploadComponent } from './fileupload/fileupload.component';
import { UserReportByEventCategoryComponent } from './user-report-by-event-category/user-report-by-event-category.component';
import { SingleRegistereduserDetailsComponent } from './single-registereduser-details/single-registereduser-details.component';
import { SignupGuestUsersComponent } from './signup-guest-users/signup-guest-users.component';
import { RegisteredusersDetailsComponent } from './registeredusers-details/registeredusers-details.component';
import { RegisteredUsersReportComponent } from './registered-users-report/registered-users-report.component';
import { RaceclasstypeComponent } from './raceclasstype/raceclasstype.component';
import { RacetypedetailsComponent } from './racetypedetails/racetypedetails.component';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';
import { ProducerComponent } from './producer.component';
import { FileUploadModule } from 'ng2-file-upload';
import { SharedModule } from './../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GuestUserPaymentComponent } from './guest-user-payment/guest-user-payment.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule, 
    ReactiveFormsModule,
    NgbModule,
    ProducerRoutingModule,
    FileUploadModule,
    SharedModule
  ],
  declarations: [
    EventsComponent, 
    ListeventsComponent, 
    DashboardComponent, 
    EventDetailsComponent, 
    EditUserEventDetailsComponent, 
    EditUsereventsignupComponent, 
    FileuploadComponent, 
    UserReportByEventCategoryComponent, 
    SingleRegistereduserDetailsComponent, 
    SignupGuestUsersComponent, 
    RegisteredusersDetailsComponent, 
    RegisteredUsersReportComponent, 
    RaceclasstypeComponent, 
    RacetypedetailsComponent, 
    ProfileEditComponent, 
    ProducerComponent,
    GuestUserPaymentComponent
  ]
})
export class ProducerModule { }
