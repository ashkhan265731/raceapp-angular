import { Component, OnInit } from '@angular/core';
import { PostFormDataService } from './../../services/post-form-data.service';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { DataService } from './../../services/data.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  pageTitle:any = "dashboard";
  serviceUrl = environment.serviceUrl;
  eventsListData: any = {};
  eventRegisteredUsersData: any = {};
  countData: any = {};
  errorLog = false;



  // public lineChartData: Array<any> = [
  //   { data: [65, 59, 80, 81, 56, 55], label: 'Registered User Events' }
  // ];
  // public lineChartLabels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

  // Pie

  public pieChartLabels: string[] = [];
  public pieChartData: number[] = [];
  public pieChartType: string = 'pie';
  constructor(
    private http: HttpClient,
    private dataService:DataService
  ) {
    this.dataService.changeMessage("dashboard");
  }

  ngOnInit() {
    var current = this;
    this.http.get(this.serviceUrl + "/getallcounts")
      .subscribe(function (res) {
        current.errorLog = false;
        current.countData = res;
      }, function (err){
        current.errorLog = true;
      });
      current.getEventsList();
      current.getAllRegisteredUsers();
    setTimeout(function () {
      current.randomizeType();
    },1500);
  }

  //graph
  // events
  public chartClicked(e: any): void {
    // console.log(e);
  }

  public chartHovered(e: any): void {
    // console.log(e);
  }

  //color line and pie chart

  public randomizeType(): void {
    this.pieChartType = this.pieChartType === 'doughnut' ? 'pie' : 'doughnut';
  }

  getEventsList() {
    var current = this;
    var response = this.http.get(this.serviceUrl+"/geteventslistslatest");
    response.subscribe(function (response) {
      current.errorLog = false;
      current.eventsListData = response;
      var events = current.eventsListData.map(function (el) {
        return el.event_name;
      });
      // console.log(events);

      current.pieChartLabels = events;
      //current.pieChartData = [];
    },function(err){
      current.errorLog = true;
    });
  }

  getAllRegisteredUsers() {
    var current = this;
    var response = this.http.get(this.serviceUrl+"/getAllRegisteredUsers");
    response.subscribe(function (response) {
      current.errorLog = false;
      current.eventRegisteredUsersData = response;
      var events = current.eventsListData.map(function (el) {
        return el._id;
      });
      //console.log(events);
      var users_events = current.eventRegisteredUsersData.map(function (el) {
        return el.event_id;
      });
    //  console.log(users_events);
      var count = 0;
      for (var i = 0; i < events.length; i++) {
        for (var j = 0; j < users_events.length; j++) {
          if (events[i] == users_events[j]) {
            count++;
          }
        }
  //      console.log(events[i] + " " + count);
        current.pieChartData.push(count);
        count = 0;
      }
//      console.log(current.pieChartData);
    }, function (err) {
      current.errorLog = true;
    });
  }

}
