import { Component, OnInit, Input, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { FileUpload } from 'ng2-fileupload';
import { FileUploader, FileSelectDirective } from 'ng2-file-upload';
import { $ } from 'protractor';
import { DaysBetweenTwoDatesService } from '../../services/days-between-two-dates.service';
import { environment } from './../../../environments/environment';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css']
})
export class EventDetailsComponent implements OnInit {
  serviceUrl = environment.serviceUrl;
  message:any;
  from_date: any;
  to_date: any;
  e_days: any = [];
  w_days: any = [];
  stalls:any;
  event_fromdate: any;
  event_todate: any;
  //  @Input('eventId') eventId: String;
  uploader: FileUploader;
  attachmentList: any = [];
  eventData: any = {};
  eventId: String = '';
  panelOpenState: boolean = false;
  raceClassDataReponse:any;
  eventSignedUpUsers:any = [];
  errorLog:any = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private daysBetweenTwoDatesService: DaysBetweenTwoDatesService
  ) {
    this.eventId = this.route.snapshot.params['id'];
    this.uploader = new FileUploader({ url: this.serviceUrl+"/uploadfiles/event/" + this.eventId });
    this.uploader.onCompleteItem = (item: any, response: any, status: any, header: any) => {
      response = JSON.parse(response);
      this.attachmentList.push(response);
      console.log(response);
      this.eventData.event_picture = response['uploadname'];
      this.uploader.clearQueue();

    }
  }

  ngOnInit() {
    this.uploader.onAfterAddingFile = (file: any) => { file.withCredentials = false; }; //this line add for all fileupload

    this.eventId = this.route.snapshot.params['id'];
    this.getEventDetails();
    this.event_fromdate = this.eventData.from_date;
    this.event_todate = this.eventData.to_date;
   
    // console.log(this.event_fromdate);

  }


  getUser(cn,cr,searchName) {
    var current = this;
    this.http.get(this.serviceUrl+"/getRegisteredUsersForEvent/"+this.eventId)
    .subscribe(function(response){
      current.errorLog=false;
      current.eventSignedUpUsers = response;

      var searchValue = cn;
      var result = current.eventSignedUpUsers.filter(function (el, index) {
      
      if(searchName == 'raceclass'){
        for( var x=0; x<=el.racetypeList.length; x++ ){
          return el.racetypeList[x].ridetype[0]==searchValue;
        }
      }
      else if(searchName == 'exhibition'){
        for( var x=0; x<=el.etimeslots.length; x++ ){
        return el.etimeslots[x].exhibition_day == searchValue;
        }
      }
      else if(searchName == 'warmup'){
        for( var x=0; x<=el.wtimeslots.length; x++ ){
          return el.wtimeslots[x].warmup_day == searchValue;
          }
        }
      else if(searchName == 'stalls'){
        return el.userStalls>=1;
      }
    })
    },function(err){
      current.errorLog=true;
    });
 

  }

  getEventDetails() {
    var current = this;

    this.http.get(this.serviceUrl+"/geteventdetails/" + this.eventId)
      .subscribe(function (response) {
        current.errorLog=false;
        current.eventData = response;
        current.getDaysBetweenEvents(response['from_date'], response['to_date']);
        current.getRaceClassType();
      },function(err){
        current.errorLog=true;
      }
    );
  }

  onUploadFiles(evt: any) {
    if (evt.error) {
      throw evt.error;
    }
    const files = evt.files;
  }
  getRaceClassType(){
    var current = this;
   // this.http.get("http://localhost:3000/getraceclasstype")
   var response = this.http.get(this.serviceUrl+"/getraceclasstype");
    response.subscribe(function(response){
      current.errorLog =false;
      current.raceClassDataReponse = response;
    },function(err){
      current.errorLog=true;
    }
  );
  }

  getDaysBetweenEvents(from, to) {
    from = new Date(from / 1);
    to = new Date(to / 1);
    if (from > to) {
      alert("from date should be lesser than to date");
      this.to_date = "";
    }
    if (from != null && to != null) {
      var dates = this.daysBetweenTwoDatesService.betweenDates(from, to);
      var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      var currentContext = this;
      currentContext.e_days = [];
      currentContext.w_days = [];
      dates.forEach(function (date) {
        currentContext.e_days.push(days[date.getDay()] + '(' + date.getMonth() + 1 + '/' + date.getDate() + ')');
        currentContext.w_days.push(days[date.getDay()] + '(' + date.getMonth() + 1 + '/' + date.getDate() + ')');
      });
    }
  }


  openDialog(EventValues, editType,formaction): void {
    EventValues.type = editType;
    EventValues.eventid = this.eventId;
    EventValues.formaction = formaction;

    if (formaction == "edit" || formaction == "add") {
      if (editType == "etimeslot") {
        EventValues.e_days = this.e_days;
      }
      else if (editType == "wtimeslot") {
        EventValues.w_days = this.w_days;
      } 
      else if (editType == "racetype") {
        EventValues.raceClass = this.raceClassDataReponse;
      }
    }
    

   


  
  }

}

