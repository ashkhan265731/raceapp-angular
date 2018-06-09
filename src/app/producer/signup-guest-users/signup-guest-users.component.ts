import { Component, OnInit, Input, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs/Rx";
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormControl, FormGroup, FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { FileUpload } from 'ng2-fileupload';
import { FileUploader, FileSelectDirective } from 'ng2-file-upload';
import { PostFormDataService } from './../../services/post-form-data.service';
import { environment } from './../../../environments/environment';
// import { DialogBoxComponent } from '../dialog-box/dialog-box.component';
import { DataService } from './../../services/data.service';
import { SocketIoService } from '../../services/socket-io.service';

@Component({
  selector: 'app-signup-guest-users',
  templateUrl: './signup-guest-users.component.html',
  styleUrls: ['./signup-guest-users.component.css']
})
export class SignupGuestUsersComponent implements OnInit , OnDestroy {
  connection: any;
  paymentMode: string;
  paymentmethod = [
    'Online',
    'Cash',    
  ];
  states = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
    'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
    'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
    'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
    'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
    'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
    'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
  ];

  @ViewChild('keyup_input') keyup_input: ElementRef;
  @ViewChild('keyup_exhibition') keyup_exhibition: ElementRef;
  @ViewChild('keyup_entryfee') keyup_entryfee: ElementRef;

  @ViewChild('keyup_winput') keyup_winput: ElementRef;
  @ViewChild('keyup_warmup') keyup_warmup: ElementRef;
  @ViewChild('keyup_wentryfee') keyup_wentryfee: ElementRef;

  @ViewChild('keyup_stallinput') keyup_stallinput: ElementRef;
  @ViewChild('keyup_ustall') keyup_ustall: ElementRef;
  @ViewChild('keyup_stallfee') keyup_stallfee: ElementRef;

  @ViewChild('keyup_hookupinput') keyup_hookupinput: ElementRef;
  @ViewChild('keyup_hookup') keyup_hookup: ElementRef;
  @ViewChild('keyup_hookupfee') keyup_hookupfee: ElementRef;

  race_document: any;
  validate_addrider: any = false;
  isEventformSubmited: any = false;

  userData: any = {};
  alertStatus: any = false;



  @Input('group')
  public options: FormGroup;
  ridetype: any;
  singleEventData: any = {};
  racetype: any = {};
  racetypeList: any = [];
  eventSignUpData: any = {};
  eventId: String = '';
  sanctionsData: any = {};
  selectedExhibitTimeSlots: any = [];
  selectedWarmupTimeSlots: any = [];
  serviceUrl = environment.serviceUrl;
  eventName: any;
  producer_id: any;
  user_id: any;
  errorLog: any = false;
  verifyEmail:any = false;
  paymentStep :any = false ;

  recaetypeid: any = Date.parse(new Date().toString()) + Math.floor((Math.random() * 1000000) + 1);


  // file upload new code
  uploader: FileUploader = new FileUploader({ url: this.serviceUrl + "/uploadfiles/usersignup/" + this.recaetypeid });

  attachmentList: any = [];
  // file upload new code


  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private cdref: ChangeDetectorRef,
    private fb: FormBuilder,
    private pfService: PostFormDataService,
    private dataService: DataService,
    private socketIoService: SocketIoService,
  ) {

    this.uploader.onAfterAddingFile = (file: any) => { file.withCredentials = false; };
    this.dataService.changeMessage('default message');

    sessionStorage.setItem("eventkey", this.recaetypeid);

    //first time upload
    this.uploader.onCompleteItem = (item: any, response: any, status: any, header: any) => {
      response = JSON.parse(response);
      this.attachmentList.push(response);
      if (this.racetypeList.length == 1) {
        this.racetypeList[this.racetypeList.length - 1]['filename'] = response.uploadname;
      }

      this.recaetypeid = response.eventid;
      this.uploader.onAfterAddingFile = (file: any) => { file.withCredentials = false; };
    }
    // file upload new code
  }

  ngOnInit() {
    this.uploader.onAfterAddingFile = (file: any) => { file.withCredentials = false; };
    var sessionvar = JSON.parse(sessionStorage.getItem('user'));
    //this.user_id = sessionvar['_id'];
    this.eventId = this.route.snapshot.params['eid'];
    this.getSingleEvent(this.eventId);
    this.cdref.detectChanges();
    //this.getUserDetails();

    /*This code will call socket io service and update sigleEventData */
    this.connection = this.socketIoService.getMessages().subscribe(message => {
      console.log('Message from socket -->');
      console.log(message);
      var data = JSON.parse(JSON.stringify(message));
      if (data._id == this.eventId) {
        this.singleEventData = JSON.stringify(message);
      }
    });

  }



  getUserDetails() {
    var current = this;
    this.http.get(this.serviceUrl + "/getuserdetails/" + this.user_id)
      .subscribe(function (response) {
        current.errorLog = false;
        current.userData = response;
        current.eventSignUpData.c_fname = current.userData.first_name;
        current.eventSignUpData.c_lname = current.userData.last_name;
        current.eventSignUpData.email = current.userData.email;
        current.eventSignUpData.address1 = current.userData.addline1;
        current.eventSignUpData.address2 = current.userData.addline2;
        current.eventSignUpData.city = current.userData.city;
        current.eventSignUpData.state = current.userData.state;
        current.eventSignUpData.zip = current.userData.zipcode;
      },
        function (err) {
          current.errorLog = true;
        }
      );
  }
  
  checkEmailDuplication(email){
    var current = this;
    var data = email.model; 
    // console.log(email.model);
    var response = this.http.post(this.serviceUrl+"/checkduplicates", {"data":data})
      .subscribe(function (res) {
        current.errorLog = false;
      if(res){
        current.verifyEmail = true;
      }else{
        current.verifyEmail = false;
      }
    },function(err){
      current.errorLog = true;
    });

  }


  addGuestUser(){
  var current= this;
    this.userData.first_name = this.eventSignUpData.c_fname;
    this.userData.last_name = this.eventSignUpData.c_fname;
    this.userData.email = this.eventSignUpData.email;
    this.userData.city = this.eventSignUpData.city;
    this.userData.state = this.eventSignUpData.state;
    this.userData.phone = this.eventSignUpData.phone;
    this.userData.zipcode = this.eventSignUpData.zip;
    this.userData.addline1 = this.eventSignUpData.address1;
    this.userData.addline2 = this.eventSignUpData.address2;
      var data = JSON.stringify(this.userData);
    var response = this.http.post(this.serviceUrl+"/registerGuestuser",{ "data": data })
      .subscribe(function (res) {
        console.log(res);
        console.log(res['_id']);
       current.user_id = res['_id'];
        return res;
      });

  }


  // file upload new code
  onUploadFiles(evt: any) {
    this.uploader.onAfterAddingFile = (file: any) => { file.withCredentials = false; };
    if (evt.error) {
      throw evt.error;
    }

    const files = evt.files;
    // You can run upload script here
  }
  // file upload new code


  getSingleEvent(id) {
    var current = this;
    //this.http.get("http://localhost:3000/getsingleevent/" + id)
    this.pfService.getFormData(current.serviceUrl + "/getsingleevent/" + id)
      .subscribe(function (response) {
        current.errorLog = false;
        current.singleEventData = response;
        current.getTotal();
        current.eventName = current.singleEventData.event_name;
        current.producer_id = current.singleEventData.producer_id;
      }, function (err) {
        current.errorLog = true;
      }
      );
  }
  ngOnDestroy() {
    console.log(this.isEventformSubmited);
    this.connection.unsubscribe();

    if (this.isEventformSubmited != true) {
      var data = "";
      data = JSON.stringify(this.racetypeList);
      //this.http.post("http://localhost:3000/deleteeventfiles/",{data:data})

      var response = this.pfService.postFormData(this.serviceUrl + "/deleteeventfiles/", data);
      response.subscribe(function (response) {
      });

    }

  }
  saveRacetypeLists() {
    
    this.racetype.id = this.recaetypeid;
    this.racetype.ridetype = this.racetype.ridetype.split("/");
    this.racetypeList.push(this.racetype);
    this.racetype = {};
    this.uploader.onAfterAddingFile = (file: any) => { file.withCredentials = false; };
    this.uploader.uploadAll();
    this.uploader = new FileUploader({ url: this.serviceUrl + "/uploadfiles/usersignup/" + this.recaetypeid });

    this.uploader.onCompleteItem = (item: any, response: any, status: any, header: any) => {
      response = JSON.parse(response);
      this.attachmentList.push(response);
      delete this.racetypeList[this.racetypeList.length - 1]['filename'];
      this.racetypeList[this.racetypeList.length - 1]['filename'] = response.uploadname;
      this.recaetypeid = response.eventid;
      this.uploader.onAfterAddingFile = (file: any) => { file.withCredentials = false; };
    }

    //document.getElementById("userform").reset();
  }

  setInitialValues() {
    var current = this;
    current.eventSignUpData.stalls_price = (current.eventSignUpData.userStalls * current.singleEventData.stalls_price) ? (current.eventSignUpData.userStalls * current.singleEventData.stalls_price) : 0
    current.eventSignUpData.electric_price = (current.eventSignUpData.electric_quantity * current.singleEventData.electric_price) ? (current.eventSignUpData.electric_quantity * current.singleEventData.electric_price) : 0;
    current.eventSignUpData.exhibitions_fee = (current.eventSignUpData.exhibitions_quantity * current.singleEventData.exhibitions_fee) ? (current.eventSignUpData.exhibitions_quantity * current.singleEventData.exhibitions_fee) : 0;
    current.eventSignUpData.warmup_fee = (current.eventSignUpData.warmup_quantity * current.singleEventData.warmup_fee) ? (current.eventSignUpData.warmup_quantity * current.singleEventData.warmup_fee) : 0;
    current.eventSignUpData.shavings_price = current.singleEventData.shavings_price ? current.singleEventData.shavings_price : 0;
    current.eventSignUpData.office_fee = current.singleEventData.office_fee ? current.singleEventData.office_fee : 0;
    current.eventSignUpData.late_fee = current.singleEventData.late_fee ? current.singleEventData.late_fee : 0;
  }

  eventSignUp() {


    this.isEventformSubmited = true;
    this.eventSignUpData.racetypeList = this.racetypeList;
    this.eventSignUpData.eventId = this.eventId;
    this.eventSignUpData.user_id = this.user_id;
    this.eventSignUpData.producer_id = this.producer_id;
    this.eventSignUpData.sanctions = this.singleEventData.sanctions;

    for (var i = 0; i < this.singleEventData.etimeslot.length; i++) {
      console.log(this.singleEventData.etimeslot[i]);
       if (this.singleEventData.etimeslot[i].selected) {
         this.selectedExhibitTimeSlots.push(this.singleEventData.etimeslot[i]);

       }else{
         this.singleEventData.etimeslot[i].exhibitions_entryFee = 0;
         this.singleEventData.etimeslot[i].entryQuantity = 0;
         this.selectedExhibitTimeSlots.push(this.singleEventData.etimeslot[i]);
       }
     }
 
     for (var i = 0; i < this.singleEventData.wtimeslot.length; i++) {
       console.log(this.singleEventData.wtimeslot[i]);
       if (this.singleEventData.wtimeslot[i].selected) {
         this.selectedWarmupTimeSlots.push(this.singleEventData.wtimeslot[i]);
       } else {
         this.singleEventData.wtimeslot[i].warmup_entry_fee = 0;
         this.singleEventData.wtimeslot[i].wentryQuantity = 0;
         this.selectedWarmupTimeSlots.push(this.singleEventData.wtimeslot[i]);
       }
     }
 

    this.eventSignUpData.etimeslots = this.selectedExhibitTimeSlots;
    this.eventSignUpData.wtimeslots = this.selectedWarmupTimeSlots;
    this.eventSignUpData.electric_quantity = this.eventSignUpData.electric_quantity?this.eventSignUpData.electric_quantity:'0';
    this.eventSignUpData.userStalls = this.eventSignUpData.userStalls?this.eventSignUpData.userStalls:'0';

    var data = JSON.stringify(this.eventSignUpData);

    var current = this;

    var response = this.pfService.postFormData(this.serviceUrl + "/eventsignup/", data)
    //    this.http.post("http://localhost:3000/eventsignup/", { "data": data })
    response.subscribe(function (response) {
      current.errorLog = false;
      current.singleEventData = response;
      this.isEventformSubmited = true;
      if(response){
console.log(response);
        // this.paymentStep = true;
        current.router.navigate(["producer/guestuserpayment/"+response['_id']]);
      }

    }, function (err) {
      current.errorLog = true;
    });
  }



  validateExhibitionquantity(event, entryQuantity, exhibitions_quantity) {

    var entryfee = 0;
    this.singleEventData.etimeslot.forEach(el => {
      if (el.entryQuantity >= el.exhibitions_quantity && el.selected) {
        var text = "Exhibitions Entry quantity should be lesser than available Exhibition quantity";
        this.dataService.changeMessage(text);
        el.entryQuantity = 0;
        el.exhibitions_entryFee = 0;
      } else {
        el.exhibitions_entryFee = el.entryQuantity * el.exhibitions_fee;
      }
      if (!isNaN(el.exhibitions_entryFee))
        entryfee = entryfee + el.exhibitions_entryFee;

    });
    this.singleEventData.exhibitions_entryFee = entryfee;

    this.calculateTotalPrice(this.singleEventData);

    // if(entryQuantity>=exhibitions_quantity){ 

    //    this.keyup_input.nativeElement.value = 0;  
    //    this.keyup_entryfee.nativeElement.value = 0;  
    //    this.keyup_exhibition.nativeElement.innerText = exhibitions_quantity;

    //    var text = "Exhibitions Entry quantity should be lesser than available Exhibition quantity";
    //    this.dataService.changeMessage(text);
    //   //  setTimeout(()=>{
    //     this.getTotal();
    //   //  },1000);
    //  // alert("Entry quantity should be lesser than available Exhibition quantity");
    // }
  }
  validateWarmupquantity(event, wentryQuantity, warmup_quantity) {
    var entryfee = 0;
    this.singleEventData.wtimeslot.forEach(el => {
      if (el.wentryQuantity >= el.warmup_quantity && el.selected) {
        var text = "Warmup Entry quantity should be lesser than available Warmup quantity";
        this.dataService.changeMessage(text);
        el.wentryQuantity = 0;
        el.warmup_entry_fee = 0;
      } else {
        el.warmup_entry_fee = el.wentryQuantity * el.warmup_fee;
      }
      if (!isNaN(el.warmup_entry_fee))
        entryfee = entryfee + el.warmup_entry_fee;
    });
    this.singleEventData.warmup_entry_fee = entryfee;

    this.calculateTotalPrice(this.singleEventData);

    // if(wentryQuantity>=warmup_quantity){ 

    //   this.keyup_winput.nativeElement.value = 0;  
    //   this.keyup_wentryfee.nativeElement.value = 0;  
    //   this.keyup_warmup.nativeElement.innerText = warmup_quantity;
    //   var text = "Warmup Entry quantity should be lesser than available Warmup quantity";
    //   this.dataService.changeMessage(text);
    //   this.getTotal();
    //   //  alert("Entry quantity should be lesser than available Warmup quantity");
    // }
  }

  validateustall(event, userStalls, stalls) {
    if (this.eventSignUpData.userStalls >= this.singleEventData.stalls) {
      var text = "Entry quantity should be lesser than available stalls quantity";
      this.dataService.changeMessage(text);
      this.eventSignUpData.userStalls = 0;
      this.eventSignUpData.stalls_price = 0;
    } else {
      if (isNaN(this.eventSignUpData.userStalls)) {
        this.eventSignUpData.stalls_price = this.eventSignUpData.userStalls * this.eventSignUpData.stalls_price;
      } 
    }
    console.log(this.eventSignUpData.userStalls);
    this.singleEventData.stalls_fee = this.eventSignUpData.stalls_price;

    this.calculateTotalPrice(this.singleEventData);

    // if(userStalls>=stalls){
    //   this.keyup_stallinput.nativeElement.value = 0;  
    //   this.keyup_stallfee.nativeElement.value = 0;  
    //   this.keyup_ustall.nativeElement.innerText = stalls;
    //   var text = "Entry quantity should be lesser than available stalls quantity";
    //   this.dataService.changeMessage(text);
    //   this.getTotal();
    //  // alert("Entry quantity should be lesser than available stalls quantity");
    // }

  }

  validatehookupquantity(event, eentryQuantity, e_quantity) {


    if (Number(eentryQuantity) >= Number(e_quantity)) {
      var text = "Entry quantity should be lesser than available Electric Hookup quantity";
      this.dataService.changeMessage(text);
      this.eventSignUpData.electric_quantity = 0;
      this.eventSignUpData.electric_price = 0;
    } else {
      if (isNaN(this.eventSignUpData.electric_quantity)) {
      this.eventSignUpData.electric_price = this.eventSignUpData.electric_quantity * this.eventSignUpData.electric_price;
      }
    }
    this.singleEventData.electric_fee = this.eventSignUpData.electric_price;
    this.calculateTotalPrice(this.singleEventData);
    //it is correct
    //console.log(eentryQuantity+">="+e_quantity);
    //   if(Number(eentryQuantity)>=Number(e_quantity)){
    //     console.log("indiedmsa");
    //     this.keyup_hookupinput.nativeElement.value = 0;  
    //     this.keyup_hookupfee.nativeElement.value = 0;  
    //     this.keyup_hookup.nativeElement.innerText = e_quantity;
    //     var text = "Entry quantity should be lesser than available Electric Hookup quantity";
    //     this.dataService.changeMessage(text);
    //     this.getTotal();
    //  //  alert("Entry quantity should be lesser than available Electric Hookup quantity");
    //   }

  }

  calculateTotalPrice(fee) {
    var exhibitions_entryFee = Number(isNaN(fee.exhibitions_entryFee) ? 0 : fee.exhibitions_entryFee);
    var warmup_entry_fee = Number(isNaN(fee.warmup_entry_fee) ? 0 : fee.warmup_entry_fee);
    var stalls_price = Number(isNaN(fee.stalls_fee) ? 0 : fee.stalls_fee);
    var electric_price = Number(isNaN(fee.electric_fee) ? 0 : fee.electric_fee);
    var shavings_price = Number(isNaN(fee.shavings_price) ? 0 : fee.shavings_price);
    var late_fee = Number(isNaN(fee.late_fee) ? 0 : fee.late_fee);
    var office_fee = Number(isNaN(fee.office_fee) ? 0 : fee.office_fee);

    var total = exhibitions_entryFee + warmup_entry_fee + stalls_price + electric_price + shavings_price + late_fee + office_fee;
    this.eventSignUpData.total_amount = total;
  }

  getTotal() {
    var current = this;
    current.setInitialValues();
    //     var total = 0;

    //       if (current.singleEventData.etimeslot != undefined) {
    //       for (let timeslot of current.singleEventData.etimeslot) {
    //         if (timeslot.selected) {
    //           if(this.keyup_input.nativeElement.value!=0){
    //          var exhibitions_fee = timeslot.exhibitions_fee ? Number(timeslot.exhibitions_fee*timeslot.entryQuantity):0;
    //         }else{
    //           exhibitions_fee = 0;
    //         }
    //         total = total + exhibitions_fee;
    //         }
    //       }
    //     }

    //     if (current.singleEventData.wtimeslot != undefined) {
    //       for (let wtimeslot of current.singleEventData.wtimeslot) {
    //         if (wtimeslot.selected) {
    //           if(this.keyup_winput.nativeElement.value!=0){
    //            var warmup_fee = wtimeslot.warmup_fee ? Number(wtimeslot.warmup_fee*wtimeslot.wentryQuantity):0;
    //           total = total + warmup_fee;
    //           }else {
    //             warmup_fee = 0;
    //           }
    //           total = total + warmup_fee;
    //         }
    //       }
    //     }

    //     // console.log(current.eventSignUpData.stalls_price);
    //     // if(this.keyup_stallinput.nativeElement.value!=0){
    //     //  var stalls_price = current.eventSignUpData.stalls_price ? Number(current.eventSignUpData.stalls_price) : 0;
    //     // }else {
    //     //   stalls_price = total-current.eventSignUpData.stalls_price;
    //     // } 
    //     // total = total + stalls_price;

    //     // if(this.keyup_hookupinput.nativeElement.value!=0){
    //     //   var electric_price =current.eventSignUpData.electric_price ? Number(current.eventSignUpData.electric_price) : 0;
    //     //  }else {
    //     //   electric_price = total - current.eventSignUpData.electric_price;
    //     //  } 
    //     //  total = total + electric_price;



    //     for (let racelist of current.racetypeList) {
    //       total = total + (racelist.ridetype[1] ? Number(racelist.ridetype[1]) : 0);
    //     }

    //     total = total + (current.eventSignUpData.stalls_price ? Number(current.eventSignUpData.stalls_price) : 0);
    //     total = total + (current.eventSignUpData.electric_price ? Number(current.eventSignUpData.electric_price) : 0);
    //     total = total + (current.eventSignUpData.exhibitions_fee ? Number(current.eventSignUpData.exhibitions_fee) : 0);
    //     total = total + (current.eventSignUpData.warmup_fee ? Number(current.eventSignUpData.warmup_fee) : 0);

    //     total = total + (current.eventSignUpData.shavings_price ? Number(current.eventSignUpData.shavings_price) : 0);
    //     total = total + (current.eventSignUpData.office_fee ? Number(current.eventSignUpData.office_fee) : 0);
    //     total = total + (current.eventSignUpData.late_fee ? Number(current.eventSignUpData.late_fee) : 0);

    //     if(total){
    //       current.eventSignUpData.total = total;
    //     }
    // console.log(total);
    //     return total;
  }



}

