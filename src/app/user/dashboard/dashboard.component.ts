import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../../services/data.service';

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
      },
      function(err){
        current.errorLog = true;
      }
    );
    this.getUpcomingEvents();
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
