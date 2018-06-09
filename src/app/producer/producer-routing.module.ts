import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EventsComponent } from './events/events.component';
import { RaceclasstypeComponent } from './raceclasstype/raceclasstype.component';
import { ListeventsComponent } from './listevents/listevents.component';
import { ProducerComponent } from './producer.component';
import { RegisteredUsersReportComponent } from './registered-users-report/registered-users-report.component';
import { FileuploadComponent } from './fileupload/fileupload.component';
import { EventDetailsComponent } from './event-details/event-details.component';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';
import { RegisteredusersDetailsComponent } from './registeredusers-details/registeredusers-details.component';
import { AuthGuardService } from '../services/auth-guard.service';
import { SingleRegistereduserDetailsComponent } from './single-registereduser-details/single-registereduser-details.component';
import { EditUserEventDetailsComponent } from './edit-user-event-details/edit-user-event-details.component';
import { EditUsereventsignupComponent } from './edit-usereventsignup/edit-usereventsignup.component';
import { UserReportByEventCategoryComponent } from './user-report-by-event-category/user-report-by-event-category.component';
import { SignupGuestUsersComponent } from './signup-guest-users/signup-guest-users.component';
import { GuestUserPaymentComponent } from './guest-user-payment/guest-user-payment.component';

const routes: Routes = [

  {
    path: '', component: ProducerComponent, canActivate: [AuthGuardService], canActivateChild: [AuthGuardService], children: [ 
      {
        path:'',redirectTo:'dashboard',pathMatch:'full'
      },
      {
        path: 'dashboard', component: DashboardComponent
      },
      {
        path: 'profile/:id', component: ProfileEditComponent
      },
      {
        path: 'events', component: EventsComponent
      },
      {
        path: 'raceclasstype', component: RaceclasstypeComponent
      },
      {
        path: 'listevents', component: ListeventsComponent
      },
      {
        path: 'eventreport', component: RegisteredUsersReportComponent
      },
      {
        path: 'fileupload', component: FileuploadComponent
      },
      {
        path: 'event_details/:id', component: EventDetailsComponent
      },
      {
        path: 'registeredusers-details/:id', component: RegisteredusersDetailsComponent
      },
      {
        path: 'single-registeredusers-details/:id', component: SingleRegistereduserDetailsComponent
      },
      {
        path: 'editusereventdetails/:id',component: EditUserEventDetailsComponent
      },
      { 
        path: 'editusereventsignup/:eid/:uid/:type',component: EditUsereventsignupComponent
      },
      { 
        path: 'userreportbyeventdetails/:eid/:searchvalue/:searchtype',component: UserReportByEventCategoryComponent
      },
      { 
        path: 'addguestuser/:eid',component: SignupGuestUsersComponent
      },
      {
        path: 'guestuserpayment/:id',component: GuestUserPaymentComponent
      }
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
exports: [RouterModule]
})
export class ProducerRoutingModule { }
