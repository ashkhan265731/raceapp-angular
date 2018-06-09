import { Component, OnInit, Input, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../../environments/environment';
import { DaysBetweenTwoDatesService } from '../../services/days-between-two-dates.service';
import { FileUpload } from 'ng2-fileupload';
import { FileUploader, FileSelectDirective } from 'ng2-file-upload';
import { SocketIoService } from '../../services/socket-io.service';
import { DataService } from '../../services/data.service';




@Component({
  selector: 'app-edit-user-event-details',
  templateUrl: './edit-user-event-details.component.html',
  styleUrls: ['./edit-user-event-details.component.css']
})
export class EditUserEventDetailsComponent implements OnInit, OnDestroy {
  serviceUrl = environment.serviceUrl;
  errorLog: any = false;
  msg: any = "";
  id: any = "";
  producer_id: any = "";
  event_id: any = "";
  f_date: any;
  producerData: any = "";
  singleUserData: any = {};
  eventData: any = {};
  data: any = {};
  eventEntries: any = {};
  recaetypeid: any;
  connection: any;

  attachmentList: any = [];
  url: any = '';
  uploader: FileUploader;// = new FileUploader({ url: this.url});

  @ViewChild('keyup_stallinput') keyup_stallinput: ElementRef;
  @ViewChild('keyup_ustall') keyup_ustall: ElementRef;
  @ViewChild('keyup_stallfee') keyup_stallfee: ElementRef;

  @ViewChild('keyup_hookupinput') keyup_hookupinput: ElementRef;
  @ViewChild('keyup_hookup') keyup_hookup: ElementRef;
  @ViewChild('keyup_hookupfee') keyup_hookupfee: ElementRef;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private daysBetweenTwoDatesService: DaysBetweenTwoDatesService,
    private socketIoService: SocketIoService,
    private dataService: DataService,

  ) { }

  /*
  attachmentList: any = [];
  url: any = '';
  */

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.getSingleUserDetails();
    
    var current = this;
    var socketObject = {};
    this.connection = this.socketIoService.getMessages().subscribe(message => {

      //http
      if (current.eventData._id) {
        current.http.get(current.serviceUrl + "/geteventdetails/" + current.eventData._id).
          subscribe((response) => {
            console.log(response);
            console.log(typeof response);
            socketObject = response;
            console.log(typeof socketObject);


            if (socketObject['_id'] == current.eventData._id) {
              if (socketObject['etimeslot']) {
                for (var i = 0; i < socketObject['etimeslot'].length; i++) {
                  console.log(parseInt(socketObject['etimeslot'][i].exhibitions_quantity));
                  current.singleUserData.etimeslots[i].exhibitions_quantity = parseInt(socketObject['etimeslot'][i].exhibitions_quantity) + parseInt(current.singleUserData.etimeslots[i].entryQuantity);
                  console.log(current.singleUserData.etimeslots[i].exhibitions_quantity);
                }
              }

              if (socketObject['wtimeslot']) {
                for (var i = 0; i < socketObject['wtimeslot'].length; i++) {
                  console.log(parseInt(socketObject['wtimeslot'][i].warmup_quantity));
                  current.singleUserData.wtimeslots[i].warmup_quantity = parseInt(socketObject['wtimeslot'][i].warmup_quantity) + parseInt(current.singleUserData.wtimeslots[i].wentryQuantity);
                  console.log(current.singleUserData.wtimeslots[i].warmup_quantity);
                }
              }
              if (socketObject['stalls']) {
                // current.singleUserData.userStalls = parseInt(socketObject['stalls']);

              }
              if (socketObject['electric_quantity']) {
                // current.singleUserData.electric_quantity = parseInt(socketObject['electric_quantity']) + parseInt(current.singleUserData.electric_quantity);

              }
            }
          })
      }
    })


  }

  ngOnDestroy() {
    this.connection.unsubscribe();
  }


  getSingleUserDetails() {
    var current = this;
    this.http.get(this.serviceUrl + "/getSingleRegisteredUsersDetails/" + this.id)
      .subscribe(function (response) {
        current.errorLog = false;
        current.singleUserData = response[0];
        console.log("-------------");
        console.log(current.singleUserData);
        current.event_id = current.singleUserData.event_id;
        current.getEventDetails(current.event_id._id);
        current.producer_id = current.singleUserData.producer_id;
        current.getProducerDetails(current.producer_id);
      }, function (err) {
        current.errorLog = true;
      }
      );
  }
  getProducerDetails(pid) {
    var current = this;
    this.http.get(this.serviceUrl + "/getuserdetails/" + pid)
      .subscribe(function (response) {
        current.errorLog = false;
        current.producerData = response;
      }, function (err) {
        current.errorLog = true;
      })
  }
  getEventDetails(id) {
    var current = this;
    this.http.get(this.serviceUrl + "/geteventdetails/" + id)
      .subscribe(function (response) {

        current.errorLog = false;
        current.eventData = response;
        current.f_date = current.eventData.from_date;
        for (var i = 0; i < current.eventData.etimeslot.length; i++) {
          current.singleUserData.etimeslots[i].exhibitions_quantity = parseInt(current.eventData.etimeslot[i].exhibitions_quantity) + parseInt(current.singleUserData.etimeslots[i].entryQuantity);
        }
        for (var i = 0; i < current.eventData.wtimeslot.length; i++) {
          current.singleUserData.wtimeslots[i].warmup_quantity = parseInt(current.eventData.wtimeslot[i].warmup_quantity) + parseInt(current.singleUserData.wtimeslots[i].wentryQuantity);
        }
        current.eventData['stalls'] = parseInt(current.eventData['stalls']) + parseInt(current.singleUserData.userStalls);
        current.eventData['electric_quantity'] = parseInt(current.eventData['electric_quantity']) + parseInt(current.singleUserData.electric_quantity);

        // current.singleUserData.userStalls = parseInt(current.eventData['stalls']) + parseInt(current.singleUserData.userStalls);
        //current.singleUserData.electric_quantity = parseInt(current.eventData['electric_quantity']) + parseInt(current.singleUserData.electric_quantity);
      }, function (err) {
        current.errorLog = true;
      });

  }

  updateRemainingQuantities() {
    //exhibitions
    var userEventEntry = this.singleUserData.etimeslots;
    var producerEventEntry = this.eventData.etimeslot;
    if (producerEventEntry && producerEventEntry) {
      for (var i = 0; i < producerEventEntry.length; i++) {
        if (producerEventEntry[i].id == userEventEntry[i].id) {
          console.log(userEventEntry[i]);
          if (userEventEntry[i].selected) {
            userEventEntry[i].exhibitions_quantity = parseInt(userEventEntry[i].exhibitions_quantity) + parseInt(userEventEntry[i].entryQuantity);
          }
        }
      }
    }
    //warmups
    var userEventEntryWarmUp = this.singleUserData.wtimeslots;
    var producerEventEntryWarmUp = this.eventData.wtimeslot;
    if (userEventEntryWarmUp && producerEventEntryWarmUp) {
      for (var i = 0; i < producerEventEntryWarmUp.length; i++) {
        if (producerEventEntryWarmUp[i].id == userEventEntryWarmUp[i].id) {
          console.log(userEventEntryWarmUp[i].wentryQuantity + " " + producerEventEntryWarmUp[i].warmup_quantity);
          if (userEventEntryWarmUp[i].selected) {
            userEventEntryWarmUp[i].warmup_quantity = parseInt(userEventEntryWarmUp[i].warmup_quantity) + parseInt(userEventEntryWarmUp[i].wentryQuantity);
            console.log("selecetd");
          }
        }
      }
    }
  }

  enableEventCancelBtn() {
    var current = this;
    var from_date = current.f_date;
    var days_result;
    var today = new Date();
    var current_today = new Date(from_date / 1);;
    //Get 1 day in milliseconds
    var one_day = 1000 * 60 * 60 * 24;

    // Convert both dates to milliseconds
    var date1_ms = today.getTime();
    var date2_ms = current_today.getTime();

    // Calculate the difference in milliseconds
    var difference_ms = date2_ms - date1_ms;

    // Convert back to days and return
    days_result = Math.round(difference_ms / one_day);
    if (days_result >= 2) {
      return false;

    } else {
      return true;
    }
  }



  delete_user(id) {
    console.log(id);
    var x = confirm("Are you sure you want to delete?");
    if (x) {
      var current = this;
      this.http.get(this.serviceUrl + "/deleteRegistereduser/" + id)
        .subscribe(function (response) {
          current.errorLog = false;

          if (response) {
            current.router.navigate(["producer/listevents"]);
          }
        }, function (err) {
          current.errorLog = true;
        });
    } else {
      return false;
    }
  }

  index: any;
  eventType: any;
  formType: any;
  addraceclass: any = {
    ridetype: '',
    filename: ''
  };

  /*-- raceclass start --*/
  edit_racetype(raceTypeObject, index, eid, uid, eventType, formType, id) {
    //this.uploader.onAfterAddingFile = (file: any) => { file.withCredentials = false; };
    this.addraceclass['filename'] = '';
    
    this.recaetypeid = id;
    console.log("racetypeid = " + this.recaetypeid);

    this.url = this.serviceUrl + "/uploadfiles/usersignup/" + this.recaetypeid;
    console.log(this.url);
    this.uploader = new FileUploader({ url: this.url });
    this.uploader.onAfterAddingFile = (file: any) => { file.withCredentials = false; };
    this.uploader.onWhenAddingFileFailed = () => { console.log("File upload failed") };

    this.index = index;
    this.eventType = eventType;
    this.formType = formType;
    if (formType == 'add') {
      this.recaetypeid = Date.parse(new Date().toString()) + Math.floor((Math.random() * 1000000) + 1);
    }
    this.url = this.serviceUrl + "/uploadfiles/usersignup/" + this.recaetypeid;
    //console.log(this.index + " " + this.eventType + " " + this.formType + " " + this.url);
  }

  enterRaceclass(eid, uid, eventType, formType) {
    this.eventType = eventType;
    this.formType = formType;
    console.log(eid + " " + uid + " " + eventType + " " + formType);
  }

  /*is this the upload function ?
  // file upload new code
  onUploadFiles(evt: any) {
    this.uploader.onAfterAddingFile = (file: any) => { file.withCredentials = false; };
    if (evt.error) {
      throw evt.error;
    }

    const files = evt.files;
    // You can run upload script here
  }
  */
  // file upload new code

  saveRaceClass(formType) {
    console.log(this.recaetypeid);

    this.url = this.serviceUrl + "/uploadfiles/usersignup/" + this.recaetypeid;
    console.log("save race class");
    //console.log(this.singleUserData.racetypeList);
    var raceclassObject = {
      ridetype: this.addraceclass.ridetype.split("/"),
      ridername: this.addraceclass.ridername,
      horsename: this.addraceclass.horsename,
      id: this.recaetypeid,
      filename: '',
    }
    if (formType == 'add') {
      this.singleUserData.racetypeList.push(raceclassObject);
      this.addraceclass.ridername = '';
      this.addraceclass.horsename = '';
    } else {
      console.log("inside save race class function ");
      console.log(this.url);
    }
    //this.addraceclass = '';

    this.uploader.onAfterAddingFile = (file: any) => { file.withCredentials = false; };
    this.uploader.uploadAll();
    console.log(this.url);
    this.uploader.options.url = this.url;

    this.uploader.onCompleteItem = (item: any, response: any, status: any, header: any) => {
      response = JSON.parse(response);
      console.log(response);
      if (this.eventType == 'racetype' && this.formType == 'add') {

        this.singleUserData.racetypeList[this.singleUserData.racetypeList.length - 1].filename = response.uploadname;
        this.uploader.onAfterAddingFile = (file: any) => { file.withCredentials = false; };
      } else if (this.eventType == 'racetype' && this.formType == 'edit') {
        this.singleUserData.racetypeList[this.index].filename = response.uploadname;
        this.uploader.onAfterAddingFile = (file: any) => { file.withCredentials = false; };
      }
    }

    console.log(this.singleUserData.racetypeList);
  }


  selecetRaceType(ridetype) {
    // console.log(ridetype);
    // console.log(ridetype.split("/"));
    this.singleUserData.racetypeList[this.index].ridetype = ridetype.split("/");
    ridetype = this.singleUserData.racetypeList[this.index].ridetype;
  }
  /*-- raceclass ends --*/

  /*-- exhibition start --*/

  edit_exhibition(exhibitionObject, index, eid, uid, eventType, formType) {
    this.index = index;
    this.eventType = eventType;
    this.formType = formType;

    console.log(this.eventData);

    var userEventEntry = this.singleUserData.etimeslots;
    var producerEventEntry = this.eventData.etimeslot;


    //code to update etime fess and quanties after edit
    // for (var i = 0; i < producerEventEntry.length; i++) {
    //   //for (var j = 0; j < userEventEntry.length; j++) {

    //   if (producerEventEntry[i].id == userEventEntry[i].id) {
    //     console.log(userEventEntry[i]);
    //     userEventEntry[i].exhibitions_quantity = userEventEntry[i].exhibitions_quantity - userEventEntry[i].entryQuantity;
    //     producerEventEntry[i].exhibitions_quantity = userEventEntry[i].exhibitions_quantity - userEventEntry[i].entryQuantity;
    //   }
    // }

  }





  enterMoreExhibition(eid, uid, eventType, formType) {
    console.log(this.singleUserData.etimeslots);
    this.eventType = eventType;
    this.formType = formType;
    console.log(eid + " " + uid + " " + eventType + " " + formType);

  }


  validateExhibitionquantity(event, entryQuantity, exhibitions_quantity) {

    var entryfee = 0;
    this.singleUserData.etimeslots.forEach((el, i) => {
      if (el.entryQuantity >= el.exhibitions_quantity && el.selected) {
        var text = "Exhibitions Entry quantity should be lesser than available Exhibition quantity";
        //this.dataService.changeMessage(text);
        el.entryQuantity = 0;
        el.exhibitions_entryFee = 0;
      } else {
        if (el.entryQuantity) {
          el.exhibitions_entryFee = el.entryQuantity * el.exhibitions_fee;
          //this.eventData.etimeslot[i].exhibitions_quantity = el.exhibitions_quantity - el.entryQuantity;
        }
      }
      if (!isNaN(el.exhibitions_entryFee))
        entryfee = entryfee + el.exhibitions_entryFee;

    });
    this.singleUserData.exhibitions_entryFee = entryfee;
  }
  /*-- exhibition ends --*/

  /*-- warmup starts --*/
  edit_warmup(warmupObject, index, eid, uid, eventType, formType) {
    this.index = index;
    this.eventType = eventType;
    this.formType = formType;

    console.log(this.eventData);

    var userEventEntry = this.singleUserData.wtimeslots;
    var producerEventEntry = this.eventData.wtimeslot;


    //code to update etime fess and quanties after edit
    // for (var i = 0; i < producerEventEntry.length; i++) {
    //   //for (var j = 0; j < userEventEntry.length; j++) {

    //   if (producerEventEntry[i].id == userEventEntry[i].id) {
    //     console.log(userEventEntry[i]);
    //     userEventEntry[i].warmup_quantity = userEventEntry[i].warmup_quantity - userEventEntry[i].wentryQuantity;
    //     producerEventEntry[i].warmup_quantity = userEventEntry[i].warmup_quantity - userEventEntry[i].wentryQuantity;
    //   }
    // }
  }

  validateWarmupquantity(event, wentryQuantity, warmup_quantity) {
    var wentryfee = 0;
    this.singleUserData.wtimeslots.forEach(el => {
      if (el.wentryQuantity >= el.warmup_quantity && el.selected) {
        var text = "Warmup Entry quantity should be lesser than available Warmup quantity";
        //this.dataService.changeMessage(text);
        el.wentryQuantity = 0;
        el.warmup_entry_fee = 0;
      } else {
        el.warmup_entry_fee = el.wentryQuantity * el.warmup_fee;
      }
      if (!isNaN(el.warmup_entry_fee))
        wentryfee = wentryfee + el.warmup_entry_fee;
    });
    this.singleUserData.warmup_entry_fee = wentryfee;
  }
  /*-- warmup ends --*/


  /*-- addons starts -- */
  validateustall(event, userStalls, stalls) {
    if (this.singleUserData.userStalls >= this.eventData.stalls) {
      var text = "Entry quantity should be lesser than available stalls quantity";
      alert(text);
      this.dataService.changeMessage(text);
      this.singleUserData.userStalls = 0;
      this.singleUserData.stalls_price = 0;
    } else {
      if (this.singleUserData.userStalls) {
        this.singleUserData.stalls_price = this.singleUserData.userStalls * this.eventData.stalls_price;
      }
    }

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
      console.log(e_quantity);
      var text = "Entry quantity should be lesser than available Electric Hookup quantity";
      this.dataService.changeMessage(text);
      this.singleUserData.electric_quantity = 0;
      this.singleUserData.electric_price = 0;
    } else {
      console.log(this.singleUserData.electric_quantity);
      if (this.singleUserData.electric_quantity) {
        console.log(e_quantity);
        console.log(this.eventData.electric_price)
        this.singleUserData.electric_price = parseInt(this.singleUserData.electric_quantity) * parseInt(this.eventData.electric_price);
      }
    }
    //this.eventData.electric_fee = this.singleUserData.electric_price;
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


  /*-- addons ends --*/
  edit_addons(eid, uid, eventType, formType) {
    this.eventType = eventType;
    this.formType = formType;

    console.log("inside addons");

    // this.validateustall('', '', '');
  }
  proceedToCheckout() {

    this.singleUserData.etimeslots.forEach(el => {

    });


    //exhibitions
    var userEventEntry = this.singleUserData.etimeslots;
    var producerEventEntry = this.eventData.etimeslot;
    for (var i = 0; i < producerEventEntry.length; i++) {
      if (producerEventEntry[i].id == userEventEntry[i].id) {
        console.log(userEventEntry[i]);
        if (userEventEntry[i].selected) {
          userEventEntry[i].exhibitions_quantity = userEventEntry[i].exhibitions_quantity - userEventEntry[i].entryQuantity;
          producerEventEntry[i].exhibitions_quantity = userEventEntry[i].exhibitions_quantity;
        } else {
          userEventEntry[i].exhibitions_quantity = parseInt(userEventEntry[i].exhibitions_quantity);
          producerEventEntry[i].exhibitions_quantity = userEventEntry[i].exhibitions_quantity;

          userEventEntry[i].entryQuantity = 0;
          userEventEntry[i].exhibitions_entryFee = 0;
        }
      }
    }

    //warmups
    var userEventEntryWarmUp = this.singleUserData.wtimeslots;
    var producerEventEntryWarmUp = this.eventData.wtimeslot;
    for (var i = 0; i < producerEventEntryWarmUp.length; i++) {
      if (producerEventEntryWarmUp[i].id == userEventEntryWarmUp[i].id) {
        console.log(userEventEntryWarmUp[i].wentryQuantity + " " + producerEventEntryWarmUp[i].warmup_quantity);
        if (userEventEntryWarmUp[i].selected) {

          userEventEntryWarmUp[i].warmup_quantity = userEventEntryWarmUp[i].warmup_quantity - userEventEntryWarmUp[i].wentryQuantity;
          producerEventEntryWarmUp[i].warmup_quantity = userEventEntryWarmUp[i].warmup_quantity;
          console.log("selecetd");
        } else {
          userEventEntryWarmUp[i].warmup_quantity = parseInt(userEventEntryWarmUp[i].warmup_quantity);
          producerEventEntryWarmUp[i].warmup_quantity = userEventEntryWarmUp[i].warmup_quantity;

          userEventEntryWarmUp[i].wentryQuantity = 0;
          userEventEntryWarmUp[i].warmup_entry_fee = 0;
          console.log("not selecetd");
        }
      }
    }

    this.data.user_id = this.singleUserData.user_id._id;
    this.data.producer_id = this.singleUserData.producer_id;
    this.data.event_id = this.singleUserData.event_id._id;
    this.data.eventsignup_id = this.singleUserData._id;
    console.log("----------------");
    console.log(producerEventEntry);
    console.log(userEventEntry);
    this.data.producerEventData = this.eventData;
    this.data.userEventData = this.singleUserData;

    var upadte_data = JSON.stringify({
      eventEntryId: this.singleUserData._id,
      eventId: this.eventData._id,
      racetypeList: this.singleUserData.racetypeList,
      etimeslots: this.singleUserData.etimeslots,
      etimeslot: this.eventData.etimeslot,
      wtimeslots: this.singleUserData.wtimeslots,
      wtimeslot: this.eventData.wtimeslot,
      userStalls: this.singleUserData.userStalls,
      stalls: this.eventData.stalls - this.singleUserData.userStalls,
      user_event_stalls_price: this.singleUserData.stalls_price,
      stalls_price: this.eventData.stalls_price,
      electric_quantity: this.eventData.electric_quantity - this.singleUserData.electric_quantity,
      user_event_electric_quantity: this.singleUserData.electric_quantity,
      electric_price: this.eventData.electric_price,
      user_event_electric_price: this.singleUserData.electric_price,


    });



    var response = this.http.post(this.serviceUrl + "/updateuserevents", { "data": upadte_data })
      .subscribe((response) => {
        console.log("response")
        // console.log(JSON.parse(response['data']));
        if (response) {
          console.log(response);
          this.router.navigate(["producer/guestuserpayment/" + this.singleUserData._id]);
        }
      });

  }

}
