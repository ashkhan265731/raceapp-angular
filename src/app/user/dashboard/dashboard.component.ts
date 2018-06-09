import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../../services/data.service';
import { PostFormDataService } from '../../services/post-form-data.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {

  serviceUrl = environment.serviceUrl;
  countData: any = {};
  upcomingData: any;
  errorLog = false;
  eventList: any;
  currentDate: any;
  user_id: any = '';
  collectSize: any = 50;
  myEventsData:any;
  constructor(
    private http: HttpClient,
    private dataService:DataService,
    private pfService: PostFormDataService,

  ) {
    this.dataService.changeMessage("dashboard");
  }

  ngOnInit() {
    var sessionvar =  JSON.parse(sessionStorage.getItem('user'));
    this.user_id=sessionvar['_id'];
    this.getMyEvents(this.user_id);
    var current = this;
    this.http.get(this.serviceUrl + "/getallcounts")
      .subscribe(function (res) {
        current.errorLog = false;
        current.countData = res;
      },
      function(err){
        current.errorLog = true;
      }
    );
    this.getUpcomingEvents();
    this.getEvents();
  }
  getMyEvents(user_id) {
    var current = this;
    this.pfService.getFormData(current.serviceUrl+ "/getusermyevents/" + user_id)
      .subscribe(function (response) {
        current.errorLog = false;
        current.myEventsData = response;
        console.log(current.myEventsData);
    },function(res){
      current.errorLog = true;
    });
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
    }, function (err) {
      current.errorLog = true;
    });
  }
  getUpcomingEvents() {
    var current_date = new Date();
    var current = this;
    this.http.get(this.serviceUrl + "/getUpcomingEvents")
      .subscribe(function (response) {
        current.errorLog = false;
        current.upcomingData = response;
        current.upcomingData = current.upcomingData.filter(element => {
        return element.from_date > current_date;
        },
      function(err){
        current.errorLog = true;
      });
      })
  }
}
