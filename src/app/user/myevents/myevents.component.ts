import { Component, OnInit } from '@angular/core';
import { PostFormDataService } from './../../services/post-form-data.service';
import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-myevents',
  templateUrl: './myevents.component.html',
  styleUrls: ['./myevents.component.css']
})
export class MyeventsComponent implements OnInit {
  errorLog = false;
  serviceUrl = environment.serviceUrl;
  myEventsData:any;
  eventsListData:any;
  user_id:any;
  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private pfService : PostFormDataService,
    private dataService:DataService
  ) {
    this.dataService.changeMessage("my_event");
   }

  ngOnInit() {
    var sessionvar =  JSON.parse(sessionStorage.getItem('user'));
    this.user_id=sessionvar['_id'];
    this.getMyEvents(this.user_id);
  }
  getMyEvents(user_id) {
    var current = this;
    //this.http.get("http://localhost:3000/getsingleevent/" + id)
    this.pfService.getFormData(current.serviceUrl+ "/getusermyevents/" + user_id)
      .subscribe(function (response) {
        current.errorLog = false;
        current.myEventsData = response;
    },function(res){
      current.errorLog = true;
    });
  }
  // getEventsList(){
  //   var current = this;
  //   //this.http.get("http://localhost:3000/geteventslists")
  //   var response = this.pfService.getFormData(this.serviceUrl +'/geteventslists/');
  //   response.subscribe(function(response){
  //     current.eventsListData = response;
  //   });
  // }


}
