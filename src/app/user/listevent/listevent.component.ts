import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { PostFormDataService } from './../../services/post-form-data.service';
import { environment } from './../../../environments/environment';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-listevent',
  templateUrl: './listevent.component.html',
  styleUrls: ['./listevent.component.css']
})
export class ListeventComponent implements OnInit {
  eventList: any;
  eventsListData: any;
  myEventsData: any;
  serviceUrl = environment.serviceUrl;
  errorLog = false;
  currentDate: any;
  length: any = 100;
  filter_from: any = Date.parse("1900-01-01T06:00:00.000Z");
  filter_to: any = Date.parse("2040-01-01T06:00:00.000Z");

  constructor(
    private http: HttpClient,
    private router: Router,
    private pfService: PostFormDataService,
    private dataService: DataService
  ) {
    this.dataService.changeMessage("list_event");
    this.getEventListCount(this.filter_from, this.filter_to);

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();
    this.currentDate = Date.parse(new Date().toString());
  }

  ngOnInit() {
    var sessionvar = JSON.parse(sessionStorage.getItem('user'));
    var user_id = sessionvar['_id'];

    this.getMyEvents(user_id);
    this.getEventsList();

  }
  getEventsList() {
    var current = this;
    //this.http.get("http://localhost:3000/geteventslists")
    var response = this.pfService.getFormData(this.serviceUrl + '/geteventslists/');
    response.subscribe(function (response) {
      current.errorLog = false;
      current.eventsListData = response;
      var currentdate = new Date();
      current.eventsListData = current.eventsListData.sort(function (a, b) {
        a = a.from_date;
        b = b.from_date;
        return a > b ? -1 : a < b ? 1 : 0;
      });
  
      setTimeout(() => {
        for (var i = 0; i < current.eventsListData.length; i++) {
          for (var j = 0; j < current.myEventsData.length; j++) {
            console.log(current.eventsListData[i]._id);
            if (current.eventsListData[i]._id == current.myEventsData[j].event_id._id) {
              current.eventsListData[i].registered = 'true';
              current.eventsListData[i].myeventsid = current.myEventsData[j]._id;
            }
          }
        }

        console.log(current.eventsListData);
      }, 1000);

      

    }, function (err) {
      current.errorLog = true;
    }

    );
  }
  getEventListCount(filter_from, filter_to) {
    var current = this;
    //this.http.get("http://localhost:3000/geteventslistCount/"+filter_from+"/"+filter_to)
    var response = this.pfService.getFormData(this.serviceUrl + "/geteventslistCount/" + filter_from + "/" + filter_to);

    response.subscribe(function (response) {
      current.errorLog = false;
      current.length = response;
    }, function (err) {
      current.errorLog = true;
    });
  }

  getMyEvents(user_id) {
    var current = this;
    //this.http.get("http://localhost:3000/getsingleevent/" + id)
    this.pfService.getFormData(current.serviceUrl + "/getusermyevents/" + user_id)
      .subscribe(function (response) {
        current.errorLog = false;
        current.myEventsData = response;
        console.log(current.myEventsData);
      }, function (res) {
        current.errorLog = true;
      });
  }
}
