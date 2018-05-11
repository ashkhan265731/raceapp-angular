import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Router, ActivatedRoute, Params} from '@angular/router';

import { PostFormDataService } from './../../services/post-form-data.service';
import { environment } from './../../../environments/environment';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-listevent',
  templateUrl: './listevent.component.html',
  styleUrls: ['./listevent.component.css']
})
export class ListeventComponent implements OnInit {
  eventsListData:any;
  serviceUrl = environment.serviceUrl;
  errorLog = false;
  constructor(
    private http:HttpClient,
    private router:Router,
    private pfService : PostFormDataService,
    private dataService:DataService
  ) {
    this.dataService.changeMessage("event_list");
   }

  ngOnInit() {
    this.getEventsList();
  }

  getEventsList(){
    var current = this;
    //this.http.get("http://localhost:3000/geteventslists")
    var response = this.pfService.getFormData(this.serviceUrl +'/geteventslists/');
    response.subscribe(function(response){
      current.errorLog = false;
      current.eventsListData = response;
    }, function (err) {
      current.errorLog = true;
    }
  
  );
  }

}
