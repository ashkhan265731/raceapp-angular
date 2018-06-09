import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ListeventComponent } from './listevent/listevent.component';
import { UsereventsignupComponent } from './usereventsignup/usereventsignup.component';
import { UserComponent } from './user.component';
import { FileuploadComponent } from './fileupload/fileupload.component';
import { AuthGuardService } from '../services/auth-guard.service';
import { AuthGuardChildService } from '../services/auth-guard-child.service';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';
import { ThankYouComponent } from './thank-you/thank-you.component';
import { MyeventsComponent } from './myevents/myevents.component';
import { MyEventDetailsComponent } from './my-event-details/my-event-details.component';
import { EditUsereventsignupComponent } from './edit-usereventsignup/edit-usereventsignup.component';
import { OrderSummaryComponent } from './order-summary/order-summary.component';


const routes: Routes = [
  {
    path:'', component: UserComponent,canActivate: [AuthGuardService], canActivateChild: [AuthGuardService], children:[
      {
        path:'',redirectTo:'dashboard',pathMatch:'full'
      },
      {
        path: 'profile/:id', component: ProfileEditComponent
      },
      {
        path: 'dashboard', component: DashboardComponent,canActivateChild:[AuthGuardChildService]
      },
      {
        path: 'listevent', component: ListeventComponent,canActivateChild:[AuthGuardChildService]
      },
      {
        path: 'usereventsignup/:id',component: UsereventsignupComponent,canActivateChild:[AuthGuardChildService]
      },
      {
        path: 'fileupload',component: FileuploadComponent,canActivateChild:[AuthGuardChildService]
      },
      {
        path: 'thankyou/:message/:id',component: ThankYouComponent,canActivateChild:[AuthGuardChildService]
      },
      {
        path: 'myevents',component: MyeventsComponent,canActivateChild:[AuthGuardChildService]
      },
      {
        path: 'myeventdetails/:id',component: MyEventDetailsComponent,canActivateChild:[AuthGuardChildService]
      },
      {
        path: 'editusereventsignup/:eid/:uid/:type',component: EditUsereventsignupComponent,canActivateChild:[AuthGuardChildService]
      },
      {
        path: 'ordersummery/:id',component: OrderSummaryComponent,canActivateChild:[AuthGuardChildService]
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
exports: [RouterModule]
})
export class UserRoutingModule { }
