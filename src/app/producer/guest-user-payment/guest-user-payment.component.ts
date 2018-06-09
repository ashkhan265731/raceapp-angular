import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../../environments/environment';
import { DaysBetweenTwoDatesService } from '../../services/days-between-two-dates.service';

@Component({
  selector: 'app-guest-user-payment',
  templateUrl: './guest-user-payment.component.html',
  styleUrls: ['./guest-user-payment.component.css']
})
export class GuestUserPaymentComponent implements OnInit {
  serviceUrl = environment.serviceUrl;
  errorLog: any = false;
  singleUserData: any = {};
  eventData: any = {};
  data: any = {};
  id: any = "";
  producer_id: any = "";
  event_id: any = "";
  producerData: any = "";
  f_date: any;
  exhibition_total: any = 0;
  exhibition_qty_total: any = 0;
  warmup_total: any = 0;
  warmup_qty_total: any = 0;
  total_fees: any = 0;
  payment_type: any;



  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.getSingleUserDetails();
  }


  getSingleUserDetails() {
    var current = this;
    this.http.get(this.serviceUrl + "/getSingleRegisteredUsersDetails/" + this.id)
      .subscribe(function (response) {
        current.errorLog = false;
        console.log(response[0]);
        current.singleUserData = response[0];
        console.log("-------------");
        console.log(current.singleUserData);
        current.event_id = current.singleUserData.event_id;
        current.getEventDetails(current.event_id._id);
        current.producer_id = current.singleUserData.producer_id;
        current.getProducerDetails(current.producer_id);
        current.singleUserData.etimeslots.forEach((el, i) => {
          current.exhibition_total = parseInt(current.exhibition_total) + parseInt(el.exhibitions_entryFee);
          current.exhibition_qty_total = parseInt(current.exhibition_qty_total) + parseInt(el.entryQuantity);
        });
        current.singleUserData.wtimeslots.forEach((el, i) => {
          current.warmup_total = parseInt(current.warmup_total) + parseInt(el.warmup_entry_fee);
          current.warmup_qty_total = parseInt(current.warmup_qty_total) + parseInt(el.wentryQuantity);
        });
        current.total_fees = parseInt(current.exhibition_total) + parseInt(current.warmup_total) + parseInt(current.singleUserData.stalls_price)
          + parseInt(current.singleUserData.electric_price) + parseInt(current.singleUserData.late_fee) + parseInt(current.singleUserData.office_fee);
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
        //current.enableEventCancelBtn(current.eventData.from_date)
      }, function (err) {
        current.errorLog = true;
      });
  }
}
