import { Component, OnInit, Inject, ViewChild, Output, EventEmitter  } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { range } from 'rxjs/observable/range';
import { PostFormDataService } from './../../services/post-form-data.service';
import { environment } from './../../../environments/environment';
import { DataService } from './../../services/data.service';
import { count } from 'rxjs/operator/count';

@Component({
  selector: 'app-listevents',
  templateUrl: './listevents.component.html',
  styleUrls: ['./listevents.component.css']
})
export class ListeventsComponent implements OnInit {
  @Output() alert: EventEmitter<any> = new EventEmitter();
  alertMessage: any = null;
  errorLog: any = false;

  //new 
  eventList: any;
  currentDate: any;

  //old
  page_to: number;
  eventsListData: any;
  eventsListDataCount: any;
  totalEvents: any;
  currentEventsPage: any;
  EventsRowCount: any;
  filter_from: any = Date.parse("1900-01-01T06:00:00.000Z");
  filter_to: any = Date.parse("2040-01-01T06:00:00.000Z");
  page_from: any = 0;
  sortBy: String = 'from_date';
  sortOrder: String = 'desc';
  search_filter = null;
  serviceUrl = environment.serviceUrl;
  panelOpenState: boolean = false;
  //Pagination
  // MatPaginator Inputs
  length: any = 100;
  pageSize = 10;
  pageSizeOptions = [5, 10, 25, 100];

  //pagination
  currentPage: any = 1;
  collectSize :any= 50;
  // pageEvent: PageEvent;

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

  //new
  getEvents() {
    var current = this;
    var response = this.pfService.getFormData(this.serviceUrl + "/geteventslists");
    response.subscribe(function (response) {
      // console.log(response);
      current.eventList = response;
      current.collectSize = Object.keys(response).length;
      //filter
      var currentdate = new Date();
      current.eventList.filter(function (el, i) {
      });
      current.eventList = current.eventList.sort(function (a, b) {
        a = a.from_date;
        b = b.from_date;
        return a > b ? -1 : a < b ? 1 : 0;
      });
    }, function (err) {
      current.errorLog = true;
          current.alertMessage = {
        type: 'danger',
        title: 'Something Went wrong. Please Contact Administartor!!',
        data: err
      };
    });
  }


  //old functions
  //filterstarts
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.search_filter = filterValue;
    this.getEventsList(this.page_from, this.pageSize, this.filter_from, this.filter_to, this.sortBy, this.sortOrder, this.search_filter);
  }

  //filterends


  pageEvent(currentPage, event) {
    setTimeout(() => {
      this.page_from = (this.currentPage-1) * this.pageSize;
      this.getEventsList(this.page_from, this.pageSize, this.filter_from, this.filter_to, this.sortBy, this.sortOrder, this.search_filter);
    }, 200);
  }

  ngOnInit() {
    this.getEvents();
    this.getEventsList(this.page_from, this.pageSize, this.filter_from, this.filter_to, this.sortBy, this.sortOrder, this.search_filter);
  }



  getEventsList(from, to, filter_from, filter_to, sort_by, sort_order, search_filter) {
    if (search_filter == "") {
      search_filter = null;
    }

    var current = this;
    var response = this.pfService.getFormData(this.serviceUrl + "/geteventslist/" + from + "/" + to + "/" + filter_from + "/" + filter_to + "/" + sort_by + "/" + sort_order + "/" + search_filter);
    //this.http.get("http://localhost:3000/geteventslist/"+from+"/"+to+"/"+filter_from+"/"+filter_to+"/"+sort_by+"/"+sort_order+"/"+search_filter)   
    response.subscribe(function (response) {
      current.errorLog = false;
      current.eventsListData = response;
      // console.log(response)
    }, function (err) {
      current.errorLog = true;
      current.alertMessage = {
        type: 'danger',
        title: 'Something Went wrong. Please Contact Administartor!!',
        data: err
      };
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
      current.alertMessage = {
        type: 'danger',
        title: 'Something Went wrong. Please Contact Administartor!!',
        data: err
      };
    });
  }


  filter(filter_from, filter_to) {
    filter_from = new Date(filter_from.year, filter_from.month - 1, filter_from.day);
    filter_to = new Date(filter_to.year, filter_to.month - 1, filter_to.day);

    this.filter_from = filter_from ? Date.parse(filter_from) : this.filter_from;
    this.filter_to = filter_to ? Date.parse(filter_to) : this.filter_to;

    this.getEventListCount(this.filter_from, this.filter_to);
    this.getEventsList(this.page_from, this.pageSize, this.filter_from, this.filter_to, this.sortBy, this.sortOrder, this.search_filter);

  }

  sort(sortBy) {
    if (this.sortOrder == 'asc') {
      this.sortOrder = 'desc';
    } else {
      this.sortOrder = 'asc';
    }

    this.getEventsList(this.page_from, this.pageSize, this.filter_from, this.filter_to, this.sortBy, this.sortOrder, this.search_filter);
  }




}
