import { Component, OnInit,Inject,ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { range } from 'rxjs/observable/range';
import { PostFormDataService } from './../../services/post-form-data.service';
import { environment } from './../../../environments/environment';
import { DataService } from './../../services/data.service';

@Component({
  selector: 'app-listevents',
  templateUrl: './listevents.component.html',
  styleUrls: ['./listevents.component.css']
})
export class ListeventsComponent implements OnInit {
  
  page_to: number;
  eventsListData:any;
  eventsListDataCount:any;
  totalEvents:any;
  currentEventsPage:any;
  EventsRowCount:any;
  filter_from:any= Date.parse("1900-01-01T06:00:00.000Z");
  filter_to:any= Date.parse("2040-01-01T06:00:00.000Z");
  page_from:any=0;
  sortBy:String = 'from_date';
  sortOrder: String = 'asc';
  search_filter=null;
  serviceUrl = environment.serviceUrl;
  errorLog:any = false;
  panelOpenState: boolean = false;
  //Pagination
 // MatPaginator Inputs
 length:any = 100;
 pageSize = 5;
 pageSizeOptions = [5, 10, 25, 100];
 // pageEvent: PageEvent;
  constructor(

    private http:HttpClient,
    private router:Router,
    private pfService : PostFormDataService,
    private dataService:DataService
  ) {
    this.dataService.changeMessage("list_event");
    this.getEventListCount(this.filter_from,this.filter_to);
    
  }
  
  //filterstarts
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.search_filter= filterValue;
    this.getEventsList(this.page_from,this.pageSize,this.filter_from,this.filter_to, this.sortBy, this.sortOrder, this.search_filter);
  }

  //filterends


  pageEvent(event){
    this.pageSize = event.pageSize;
    this.page_from = event.pageIndex*event.pageSize;
    this.getEventsList(this.page_from,this.pageSize,this.filter_from,this.filter_to, this.sortBy, this.sortOrder, this.search_filter);
  }

  ngOnInit() {  
    this.getEvents();  
    this.getEventsList(this.page_from,this.pageSize,this.filter_from,this.filter_to, this.sortBy, this.sortOrder, this.search_filter);
    }

    getEvents(){
      var current = this;
      var response = this.pfService.getFormData(this.serviceUrl+"/geteventslists");
      response.subscribe(function(response){
        console.log(response);
      },function(err){
        current.errorLog = true;
      });
    }

  getEventsList(from,to,filter_from,filter_to,sort_by, sort_order,search_filter){
    if(search_filter==""){
      search_filter = null;
    }

    var current = this;
    var response = this.pfService.getFormData(this.serviceUrl+"/geteventslist/"+from+"/"+to+"/"+filter_from+"/"+filter_to+"/"+sort_by+"/"+sort_order+"/"+search_filter);
    //this.http.get("http://localhost:3000/geteventslist/"+from+"/"+to+"/"+filter_from+"/"+filter_to+"/"+sort_by+"/"+sort_order+"/"+search_filter)   
    response.subscribe(function(response){
      current.errorLog=false;
      current.eventsListData = response;
    },function(err){
      current.errorLog=true;
    }
  );

    // MatPaginator Output
  }
  getEventListCount(filter_from,filter_to){
    var current = this;
    //this.http.get("http://localhost:3000/geteventslistCount/"+filter_from+"/"+filter_to)
    var response = this.pfService.getFormData(this.serviceUrl+"/geteventslistCount/"+filter_from+"/"+filter_to);

    response.subscribe(function(response){
      current.errorLog  = false;
      current.length = response;
    },function(err){
      current.errorLog = true;
    });
  }

  dateFilter(){

  }
  
  filter(filter_from,filter_to){
    filter_from = new Date(filter_from.year, filter_from.month-1, filter_from.day);
    filter_to = new Date(filter_to.year, filter_to.month-1, filter_to.day);

    this.filter_from = filter_from ? Date.parse(filter_from): this.filter_from;
    this.filter_to = filter_to ? Date.parse(filter_to): this.filter_to;

    this.getEventListCount(this.filter_from,this.filter_to);
    this.getEventsList(this.page_from,this.pageSize,this.filter_from,this.filter_to, this.sortBy, this.sortOrder,this.search_filter);

  }

  sort(sortBy){
    if(this.sortOrder=='asc'){
      this.sortOrder='desc';
    }else {
      this.sortOrder = 'asc';
    }

    this.getEventsList(this.page_from,this.pageSize,this.filter_from,this.filter_to, this.sortBy, this.sortOrder, this.search_filter);
  }


  

}
