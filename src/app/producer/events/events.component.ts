import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormArray, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { DaysBetweenTwoDatesService } from './../../services/days-between-two-dates.service';
import { environment } from '../../../environments/environment';
import { PostFormDataService } from './../../services/post-form-data.service';
import { DataService } from './../../services/data.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
  @Output() alert: EventEmitter<any> = new EventEmitter();
  @ViewChild('f2') f2;
  @ViewChild('f8') f8;
  @ViewChild('f3') f3;
  alertMessage: any = null;
  serviceUrl = environment.serviceUrl;
  time = { hour: 13, minute: 30 };
  modelData: any = {};
  producer_id: any;
  event: any = {
    racetype: [],
    etimeslot: [],
    wtimeslot: [],
    sanctions: [],
    late_fee: '0',
    office_fee: '0',
    stalls: '0',
    stalls_price: '0',
    shavings_quantity: '0',
    shavings_price: "0",
    electric_quantity: "0",
    electric_price: "0",
    producer_id: '',
    event_picture: ''
  };
  raceclass: any = {};
  exhibition: any = {};
  warmup: any = {};
  sanction: any = {};
  e_days: any;
  w_days: any;
  due_date: any;
  registration_start_date:any;
  website_link:any = '';

  validateDate: any = false;
  validateEFromTime: any = false;
  validateEToTime: any = false;
  validateExhibition: any = false;
  validateWFromTime: any = false;
  validateWToTime: any = false;
  validateWarmup: any = false;
  validateDueDate: any = false;
  validateRegStartDate:any = false;
  currentDate:any;

  states = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
    'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
    'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
    'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
    'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
    'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
    'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
  ];

  constructor(
    private daysBetweenTwoDatesService: DaysBetweenTwoDatesService,
    private postFormDataService: PostFormDataService,
    private http: HttpClient,
    private router: Router,
    private _fb: FormBuilder,
    private dataService: DataService
  ) {
    this.dataService.changeMessage("create_event");
    var date = new Date();
     this.currentDate = new Date(date.getFullYear(),date.getMonth()+1,date.getDate());
  }

  ngOnInit() {

    var sessionvar = JSON.parse(sessionStorage.getItem('user'));
    this.producer_id = sessionvar['_id'];

  }

  getValidateDate(fromdate, todate) {
    if (fromdate && todate) {
      var current_date = Date.parse(this.currentDate.toString());

      var from_date = Date.parse(new Date(fromdate.year, fromdate.month, fromdate.day).toString());
      var to_date = Date.parse(new Date(todate.year, todate.month, todate.day).toString());
      if (from_date < to_date && from_date>current_date) {
        this.validateDate = false;
        //calculate days between dates
        this.getExhibitionDays(fromdate, todate);
      } else {
        this.validateDate = true;
      }
    }
  }

  getValidateDueDate(fromdate, duedate) {
    
    //parse date
    var from_date = Date.parse(new Date(fromdate.year, fromdate.month, fromdate.day).toString());
    var due_date = Date.parse(new Date(duedate.year, duedate.month, duedate.day).toString());
      if (due_date < from_date) {
      this.validateDueDate = false;
    } else {
      this.validateDueDate = true;
    }

  }
  getValidateRegStartDate(fromdate, registrationstartdate) {
    
    //parse date
    var current_date = Date.parse(this.currentDate.toString());
    var from_date = Date.parse(new Date(fromdate.year, fromdate.month, fromdate.day).toString());
    var registration_start_date = Date.parse(new Date(registrationstartdate.year, registrationstartdate.month, registrationstartdate.day).toString());
    
    if (registration_start_date < from_date && registration_start_date >= current_date) {        
      this.validateRegStartDate = false;
    } else {
      this.validateRegStartDate = true;
    }
  
  }

  getValidateEFromTime() {
    if (this.exhibition.from_time == null) {
      this.validateEFromTime = true;
    } else {
      this.validateEFromTime = false;
    }
  }
  getValidateEToTime() {
    if (this.exhibition.to_time == null) {
      this.validateEToTime = true;
    } else {
      this.validateEToTime = false;
    }
  }

  resetETime() {
    var _this = this;
    setTimeout(function () {
      console.log(_this.validateEFromTime);
      _this.validateEFromTime = false;
      _this.validateEToTime = false;
      console.log(_this.validateEFromTime);
    }, 500)

  }

  getValidateWFromTime() {
    if (this.warmup.from_time == null) {
      this.validateWFromTime = true;
    } else {
      this.validateWFromTime = false;
    }
  }
  getValidateWToTime() {
    if (this.warmup.to_time == null) {
      this.validateWToTime = true;
    } else {
      this.validateWToTime = false;
    }
  }
  resetWTime() {
    var _this = this;
    setTimeout(function () {
      _this.validateWFromTime = false;
      _this.validateWToTime = false;

    }, 500)

  }

  // getValidateExhibition() {
  //   if (this.exhibition.e_days == "" && this.exhibition.exhibitions_quantity == "" && this.exhibition.exhibitions_fee == "" && this.exhibition.from_time == "" && this.exhibition.to_time == "") {
  //     return false
  //   } else {
  //     return true;
  //   }
  // }

  // getValidateWarmup() {
  //   if (this.warmup.e_days == "" && this.warmup.warmup_quantity == "" && this.warmup.warmup_fee == "" && this.warmup.from_time == "" && this.warmup.to_time == "") {
  //     return false
  //   } else {
  //     return true;
  //   }
  // }

  addRaceClass(raceclassData) {
    var obj = {
      type: raceclassData.type,
      price: raceclassData.price
    }
    this.event.racetype.push(obj);
    //raceclassData.type = '';
    //raceclassData.price = '';
   this.f2.reset();
    
  }


  removeRaceClass(index) {
    this.event.racetype.splice(index, 1);
  }

  //get days between two dates
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


  addExhibitionTimeSlot(exhibitionData) {
    var date = new Date();
    var rand = Math.floor((Math.random() * 1000000) + 1);
    var id = Date.parse(date.toString()) + rand;
    var obj = {
      id: id,
      from: exhibitionData.from_time,
      to: exhibitionData.to_time,
      exhibition_day: exhibitionData.e_days,
      exhibitions_quantity: exhibitionData.exhibitions_quantity,
      exhibitions_fee: exhibitionData.exhibitions_fee
    }
    this.event.etimeslot.push(obj);
   //resetting after push
   var _this = this;
    this.f8.reset();
    _this.validateEFromTime = false;
    _this.validateEToTime = false;
  }
  removeExhibitionTimeSlot(index) {
    this.event.etimeslot.splice(index, 1);
  }
  addWarmupTimeSlot(warmupData) {
    var date = new Date();
    var rand = Math.floor((Math.random() * 1000000) + 1);
    var id = Date.parse(date.toString()) + rand;
    var obj = {
      id: id,
      from: warmupData.from_time,
      to: warmupData.to_time,
      warmup_day: warmupData.w_days,
      warmup_quantity: warmupData.warmup_quantity,
      warmup_fee: warmupData.warmup_fee
    }
    this.event.wtimeslot.push(obj);
// reset form after push
    this.f3.reset();
    var _this = this;
      _this.validateWFromTime = false;
      _this.validateWToTime = false;
  }
  removeWarmupTimeSlot(index) {
    this.event.wtimeslot.splice(index, 1);
  }
  addSanction(sanctionData) {
    var obj = {
      sanction_name: sanctionData.sanction_name,
    }
    this.event.sanctions.push(obj);
    console.log(this.event.sanctions);
    this.sanction.sanction_name = '';
  }

  removeSanction(index) {
    this.event.sanctions.splice(index, 1);
  }

  addEvent() {

    // if(this.getValidateExhibition()){
    //   this.validateExhibition = true;
    //   return true;
    // }
    console.log(this.event);
    var currentContext = this;

    currentContext.event.producer_id = this.producer_id;
    var fromdate = new Date(this.event.from_date.year, this.event.from_date.month - 1, this.event.from_date.day);
    var todate = new Date(this.event.to_date.year, this.event.to_date.month - 1, this.event.to_date.day);
    
    if(this.event.due_date){
      var duedate = new Date(this.event.due_date.year, this.event.due_date.month - 1, this.event.due_date.day);
    }else{
      var duedate = fromdate;
    }
    var registrationstartdate;
    if(this.event.registration_start_date){
      registrationstartdate = new Date(this.event.registration_start_date.year, this.event.registration_start_date.month - 1, this.event.registration_start_date.day);
    }else{
      registrationstartdate = this.currentDate;
    }
    

    this.event.from_date = Date.parse(fromdate.toString());
    this.event.to_date = Date.parse(todate.toString());
    this.event.due_date = Date.parse(duedate.toString());
    this.event.registration_start_date = Date.parse(registrationstartdate.toString());

    var data = JSON.stringify(this.event);
    var response = this.postFormDataService.postFormData(this.serviceUrl + "/createevent", data);
    response.subscribe(function (res) {
      // console.log(res);
      currentContext.alertMessage = {
        type: 'success',
        title: 'Event Created Successfully!!',
        data: ''
      };
      setTimeout(function () {
        currentContext.router.navigate(["producer/event_details" + "/" + res['_id']])
      }, 2000);

      return res;
    },
      function (err) {
        currentContext.alertMessage = {
          type: 'danger',
          title: 'Something Went wrong. Please Contact Administartor',
          data: err
        };
      });

  }
}
