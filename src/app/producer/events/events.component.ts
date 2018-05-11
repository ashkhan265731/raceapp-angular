import { Component, OnInit, Input } from '@angular/core';
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

  validateDate: any = false;
  validateEFromTime: any = false;
  validateEToTime: any = false;
  validateExhibition: any = false;
  validateWFromTime: any = false;
  validateWToTime: any = false;
  validateWarmup: any = false;
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
  }

  ngOnInit() {
    var sessionvar = JSON.parse(sessionStorage.getItem('user'));
    this.producer_id = sessionvar['_id'];

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
    setTimeout(function(){
      console.log(_this.validateEFromTime);
      _this.validateEFromTime = false;
      _this.validateEToTime = false;
      console.log(_this.validateEFromTime);
    },500)
  
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
    setTimeout(function(){
      _this.validateWFromTime = false;
      _this.validateWToTime = false;
    
    },500)
  
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
      from: exhibitionData.from_time.hour + " : " + exhibitionData.from_time.minute,
      to: exhibitionData.to_time.hour + " : " + exhibitionData.from_time.minute,
      exhibition_day: exhibitionData.e_days,
      exhibitions_quantity: exhibitionData.exhibitions_quantity,
      exhibitions_fee: exhibitionData.exhibitions_fee
    }
    this.event.etimeslot.push(obj);

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
      from: warmupData.from_time.hour + " : " + warmupData.from_time.minute,
      to: warmupData.to_time.hour + " : " + warmupData.to_time.minute,
      warmup_day: warmupData.w_days,
      warmup_quantity: warmupData.warmup_quantity,
      warmup_fee: warmupData.warmup_fee
    }
    this.event.wtimeslot.push(obj);

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
    this.event.from_date = Date.parse(fromdate.toString());
    this.event.to_date = Date.parse(todate.toString());



    var data = JSON.stringify(this.event);
    //var response = this.http.post("http://localhost:3000/createevent", { "data": data })
    var response = this.postFormDataService.postFormData(this.serviceUrl + "/createevent", data);
    response.subscribe(function (res) {
      console.log(res);

      setTimeout(function () {
        currentContext.router.navigate(["producer/event_details" + "/" + res['_id']])
      }, 2000);

      return res;
    });

  }
}
