import { Component, OnInit, Output, EventEmitter } from '@angular/core';
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
  @Output() alert: EventEmitter<any> = new EventEmitter();
  pageTitle: any = "dashboard";
  serviceUrl = environment.serviceUrl;
  eventsListData: any = {};
  eventRegisteredUsersData: any = {};
  countData: any = {};
  errorLog = false;
  fname: any = '';
  lname: any = '';
  eventList: any;
  producerEvents: any;
  currentDate: any;
  userid: any = '';
  collectSize: any = 50;
  alertMessage: any = null; //this one and in top import input

  public pieChartLabels: string[] = [];
  public pieChartData: number[] = [];
  public pieChartType: string = 'pie';
  constructor(
    private http: HttpClient,
    private dataService: DataService,
    private pfService: PostFormDataService,

  ) {
    this.dataService.changeMessage("dashboard");
  }

  ngOnInit() {

    setTimeout(() => {
      this.alertMessage = {
        type: 'danger',
        title: 'U can add any title here',
        data: 'some data'
      };
    }, 5000);

    var current = this;
    this.getUserDetails();
    this.http.get(this.serviceUrl + "/getallcounts")
      .subscribe(function (res) {
        current.errorLog = false;
        current.countData = res;
      }, function (err) {
        current.errorLog = true;
        current.alertMessage = {
          type: 'danger',
          title: 'Something Went wrong. Please Contact Administartor',
          data: err
        };
      });
    current.getEventsList();
    current.getAllRegisteredUsers();
    setTimeout(function () {
      current.randomizeType();
    }, 1500);

    this.getEvents();
  }

  getUserDetails() {
    var current = this;
    this.userid = JSON.parse(sessionStorage.getItem('user'))._id;
    this.fname = JSON.parse(sessionStorage.getItem('user')).first_name;
    this.lname = JSON.parse(sessionStorage.getItem('user')).last_name;
  }

  //new
  getEvents() {
    var current = this;
    var response = this.pfService.getFormData(this.serviceUrl + "/geteventslists");
    response.subscribe(function (response) {
      console.log(response);
      current.eventList = response;
      current.collectSize = Object.keys(response).length;
      //filter
      current.currentDate = new Date();

      current.eventList = current.eventList.sort(function (a, b) {
        a = a.from_date;
        b = b.from_date;
        return a > b ? -1 : a < b ? 1 : 0;
      });


      //producer events
      current.producerEvents = current.eventList.filter(function (el, i) {
        return el.producer_id == current.userid;
      });


    }, function (err) {
      current.errorLog = true;
    });
  }

  /*
  profileUpdated(isUpdated:Boolean) {
    console.log('*********Profile update called********')
    this.getUserDetails();
  }
  */
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
    var response = this.http.get(this.serviceUrl + "/geteventslistslatest");
    response.subscribe(function (response) {
      current.errorLog = false;
      current.eventsListData = response;
      var events = current.eventsListData.map(function (el) {
        return el.event_name;
      });
      // console.log(events);

      current.pieChartLabels = events;
      //current.pieChartData = [];
    }, function (err) {
      current.errorLog = true;
    });
  }

  getAllRegisteredUsers() {
    var current = this;
    var response = this.http.get(this.serviceUrl + "/getAllRegisteredUsers");
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
