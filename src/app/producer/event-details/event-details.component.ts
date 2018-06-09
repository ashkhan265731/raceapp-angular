import { Component, OnInit, Input, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { FileUpload } from 'ng2-fileupload';
import { FileUploader, FileSelectDirective } from 'ng2-file-upload';
import { $ } from 'protractor';
import { DaysBetweenTwoDatesService } from '../../services/days-between-two-dates.service';
import { environment } from './../../../environments/environment';
import { range } from 'rxjs/observable/range';
import {Location} from '@angular/common';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css']
})
export class EventDetailsComponent implements OnInit {
  serviceUrl = environment.serviceUrl;
  message: any;
  from_date: any;
  to_date: any;
  e_days: any = [];
  w_days: any = [];
  stalls: any;
  event_fromdate: any;
  event_todate: any;
  //  @Input('eventId') eventId: String;
  uploader: FileUploader;
  attachmentList: any = [];
  eventData: any = {};
  eventId: String = '';
  panelOpenState: boolean = false;
  raceClassDataReponse: any;
  eventSignedUpUsers: any = [];
  errorLog: any = false;
  alertMessage: any = null;
  sessionid: any;
  modalTitle: any = "Add/Edit";

  /*modal varibles*/
  modalFormAction: any;
  modalFormType: any;
  raceclass: any = {};

  exhibition: any = {};
  warmup: any = {};

  validateDate: any = false;
  validateEFromTime: any = false;
  validateEToTime: any = false;
  validateExhibition: any = false;
  validateWFromTime: any = false;
  validateWToTime: any = false;
  validateWarmup: any = false;
  time = { hour: 13, minute: 30 };
  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private daysBetweenTwoDatesService: DaysBetweenTwoDatesService,
    private _location: Location
  ) {
    this.eventId = this.route.snapshot.params['id'];
    this.uploader = new FileUploader({ url: this.serviceUrl + "/uploadfiles/event/" + this.eventId });
    this.uploader.onCompleteItem = (item: any, response: any, status: any, header: any) => {
      response = JSON.parse(response);
      this.attachmentList.push(response);
      console.log(response);
      this.eventData.event_picture = response['uploadname'];
      this.uploader.clearQueue();

    }
  }

  ngOnInit() {
  
    var session = JSON.parse(sessionStorage.getItem("user"));

    this.sessionid = session._id;
    // if(session._id == )
    this.uploader.onAfterAddingFile = (file: any) => { file.withCredentials = false; }; //this line add for all fileupload

    this.eventId = this.route.snapshot.params['id'];
    this.getEventDetails();
    this.event_fromdate = this.eventData.from_date;
    this.event_todate = this.eventData.to_date;

    // console.log(this.event_fromdate);

  }


  getUser(cn, cr, searchName) {
    var current = this;
    this.http.get(this.serviceUrl + "/getRegisteredUsersForEvent/" + this.eventId)
      .subscribe(function (response) {
        current.errorLog = false;
        current.eventSignedUpUsers = response;

        var searchValue = cn;
        var result = current.eventSignedUpUsers.filter(function (el, index) {

          if (searchName == 'raceclass') {
            for (var x = 0; x <= el.racetypeList.length; x++) {
              return el.racetypeList[x].ridetype[0] == searchValue;
            }
          }
          else if (searchName == 'exhibition') {
            for (var x = 0; x <= el.etimeslots.length; x++) {
              return el.etimeslots[x].exhibition_day == searchValue;
            }
          }
          else if (searchName == 'warmup') {
            for (var x = 0; x <= el.wtimeslots.length; x++) {
              return el.wtimeslots[x].warmup_day == searchValue;
            }
          }
          else if (searchName == 'stalls') {
            return el.userStalls >= 1;
          }
        })
      }, function (err) {
        current.errorLog = true;
        current.alertMessage = {
          type: 'danger',
          title: 'Something Went wrong. Please Contact Administartor',
          data: err
        };
      });


  }

  getEventDetails() {
    var current = this;

    this.http.get(this.serviceUrl + "/geteventdetails/" + this.eventId)
      .subscribe(function (response) {
        current.errorLog = false;
        current.eventData = response;
        current.getDaysBetweenEvents(response['from_date'], response['to_date']);
        current.getRaceClassType();
      }, function (err) {
        current.errorLog = true;
        current.alertMessage = {
          type: 'danger',
          title: 'Something Went wrong. Please Contact Administartor',
          data: err
        };
      }
      );
  }

  onUploadFiles(evt: any) {
    if (evt.error) {
      throw evt.error;
    }
    const files = evt.files;
  }
  getRaceClassType() {
    var current = this;
    // this.http.get("http://localhost:3000/getraceclasstype")
    var response = this.http.get(this.serviceUrl + "/getraceclasstype");
    response.subscribe(function (response) {
      current.errorLog = false;
      current.raceClassDataReponse = response;
    }, function (err) {
      current.errorLog = true;
      current.alertMessage = {
        type: 'danger',
        title: 'Something Went wrong. Please Contact Administartor',
        data: err
      };
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
  getExhibitionDays(from, to) {

    if (from != null && to != null) {
      var fromdate = new Date(from.year, from.month - 1, from.day);
      var todate = new Date(to.year, to.month - 1, to.day);
      var dates = this.daysBetweenTwoDatesService.betweenDates(fromdate, todate);

      // Usage
      var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      var currentContext = this;
      this.e_days = [];
      this.w_days = [];
      dates.forEach(function (date) {
        currentContext.e_days.push(days[date.getDay()] + '(' + (date.getMonth() + 1) + '/' + date.getDate() + ')');
        currentContext.w_days.push(days[date.getDay()] + '(' + (date.getMonth() + 1) + '/' + date.getDate() + ')');

      });
    }
  }


  // validation function
  validateStalls(){
    if(!this.eventData.stalls){
      this.eventData.stalls = 0;
    }

    if(this.eventData.stalls<=0){
      this.eventData.stalls_price = 0;
    }
  }

  validateElectric(){
    if(!this.eventData.electric_quantity){
      this.eventData.electric_quantity = 0;
    }

    if(this.eventData.electric_quantity<=0){
      this.eventData.electric_price = 0;
    }
  }
  validateShavings(){
    if(!this.eventData.shavings_quantity){
      this.eventData.shavings_quantity = 0;
    }

    if(this.eventData.shavings_quantity<=0){
      this.eventData.shavings_price = 0;
    }
  }
  getValidateDate(fromdate, todate) {
    if (fromdate && todate) {
      if (fromdate.year <= todate.year && fromdate.month <= todate.month && fromdate.day <= todate.day) {
        this.validateDate = false;
        //calculate days between dates
        this.getExhibitionDays(fromdate, todate);
      } else {
        this.validateDate = true;
      }
    }
  }

  getValidateEFromTime(from_time) {
    console.log(from_time);
   
    if (from_time == null) {
      this.validateEFromTime = true;
    } else {
      this.validateEFromTime = false;
    }
  }
  getValidateEToTime(to_time) {
    if (to_time == null) {
      this.validateEToTime = true;
    } else {
      this.validateEToTime = false;
    }
  }

  resetETime() {
    var current = this;
    setTimeout(function () {
      console.log(current.validateEFromTime);
      current.validateEFromTime = false;
      current.validateEToTime = false;
      console.log(current.validateEFromTime);
    }, 500)

  }

  getValidateWFromTime(from_time) {
    if (from_time == null) {
      this.validateWFromTime = true;
    } else {
      this.validateWFromTime = false;
    }
  }
  getValidateWToTime(to_time) {
    if (to_time == null) {
      this.validateWToTime = true;
    } else {
      this.validateWToTime = false;
    }
  }
  
  resetWTime() {
    var current = this;
    setTimeout(function () {
      current.validateWFromTime = false;
      current.validateWToTime = false;

    }, 500)

  }

  //validaion functions

  modalFormIndex: any;
  openDialog(EventValues, editType, formaction, index): void {
    this.modalFormIndex = index;
    this.modalFormAction = formaction;
    this.modalFormType = editType;

    //reset validation parametes values
    this.validateEFromTime = false;
    this.validateEToTime = false;
    this.validateWFromTime = false;
    this.validateWToTime = false;
    this.exhibition.e_days = this.e_days[0];
    this.warmup.w_days = this.w_days[0];

  }

  closePopup(form, formAction) {
    if(formAction=='add'){
      form.reset();
    }
  
    this.getEventDetails();
  }

  updateEvent(form, formAction) {
    
    var current = this;
    var data;
    //raceclass
    if (this.modalFormType == "racetype" && this.modalFormAction == 'edit') {
      data = JSON.stringify(this.eventData.racetype);
    } else if (this.modalFormType == "racetype" && this.modalFormAction == 'add') {
      var obj = {
        type: this.raceclass.type,
        price: this.raceclass.price
      }
      this.eventData.racetype.push(obj);
      data = JSON.stringify(this.eventData.racetype);
      // console.log(data);
    }

    //exhibition
    if (this.modalFormType == "etimeslot" && this.modalFormAction == 'edit') {
      data = JSON.stringify(this.eventData.etimeslot);
    } else if (this.modalFormType == "etimeslot" && this.modalFormAction == 'add') {
      var date = new Date();
      var rand = Math.floor((Math.random() * 1000000) + 1);
      var id = Date.parse(date.toString()) + rand;
      var exhibition_object = {
        id: id,
        from: this.exhibition.from_time,
        to: this.exhibition.to_time,
        exhibition_day: this.exhibition.e_days,
        exhibitions_quantity: this.exhibition.exhibitions_quantity,
        exhibitions_fee: this.exhibition.exhibitions_fee
      }
      this.eventData.etimeslot.push(exhibition_object);
      data = JSON.stringify(this.eventData.etimeslot);
    }
    //warmup
    if (this.modalFormType == "wtimeslot" && this.modalFormAction == 'edit') {
      data = JSON.stringify(this.eventData.wtimeslot);
      // console.log("edit");
    } else if (this.modalFormType == "wtimeslot" && this.modalFormAction == 'add') {
      // console.log("add");
      var date = new Date();
      var rand = Math.floor((Math.random() * 1000000) + 1);
      var id = Date.parse(date.toString()) + rand;
      var warmup_object = {
        id: id,
        from: this.warmup.from_time,
        to: this.warmup.to_time,
        warmup_day: this.warmup.w_days,
        warmup_quantity: this.warmup.warmup_quantity,
        warmup_fee: this.warmup.warmup_fee
      }
      this.eventData.wtimeslot.push(warmup_object);
      data = JSON.stringify(this.eventData.wtimeslot);
    }

    //add ons
    if (this.modalFormType == "addons" && this.modalFormAction == 'edit') {

      data = {
        "stalls": this.eventData.stalls,
        "stalls_price": this.eventData.stalls_price,
        "shavings_quantity":this.eventData.shavings_quantity,
        "shavings_price": this.eventData.shavings_price,
        "electric_quantity": this.eventData.electric_quantity,
        "electric_price": this.eventData.electric_price,
        "late_fee": this.eventData.late_fee,
        "office_fee": this.eventData.office_fee,
      }
      data = JSON.stringify(data);
    }

    // console.log("save event");
    // console.log(data);
    // console.log(this.modalFormType);
    var response = this.http.post(this.serviceUrl + "/updateevent/" + this.eventId + "/" + this.modalFormType, { "data": data })
      .subscribe(function (response) {
        current.errorLog = false;
        current.alertMessage = {
          type: 'success',
          title: 'Event Edited Successfully',
          data: ''
        };
        if(formAction=='add'){
          form.reset();
        }
        
      }, function (err) {
        current.errorLog = true;
        current.alertMessage = {
          type: 'danger',
          title: 'Something Went wrong. Please Contact Administartor',
          data: err
        };
      }
      );

  }

  goBack(){
    this._location.back();

  }
}

