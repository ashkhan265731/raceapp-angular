import { Router, ActivatedRoute, Params } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { range } from 'rxjs/observable/range';
import { PostFormDataService } from './../../services/post-form-data.service';
import { environment } from './../../../environments/environment';

@Component({
  selector: 'app-registeredusers-details',
  templateUrl: './registeredusers-details.component.html',
  styleUrls: ['./registeredusers-details.component.css']
})
export class RegisteredusersDetailsComponent implements OnInit {
  position = 'before';
  eventSignedUpUsers: any = [];
  eventId: String;
  producerId: String;
  page_to: number;
  page_from:any=0;
  sortBy:String = 'c_fname';
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
    private route: ActivatedRoute,
  ) { 
    this.eventId = this.route.snapshot.params['id'];
    this.getRegisteresUsersCount();
  }
  pageEvent(event){
    this.pageSize = event.pageSize;
    this.page_from = event.pageIndex*event.pageSize;
    this.getUserDetails(this.page_from,this.pageSize,this.sortBy, this.sortOrder,this.search_filter);
  }

  ngOnInit() {
    this.producerId = JSON.parse(sessionStorage.getItem('user'))._id;
    this.getUserDetails(this.page_from,this.pageSize,this.sortBy, this.sortOrder,this.search_filter);
    
  }
  //filterstarts
  applySearchFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.search_filter= filterValue;
    this.getUserDetails(this.page_from,this.pageSize, this.sortBy, this.sortOrder,this.search_filter);
  }

  getUserDetails(from,to,sort_by, sort_order,search_filter){
    if(search_filter==""){
      search_filter = null;
    }
    var current = this;
    this.http.get(this.serviceUrl+"/geteventsignedupusers/"+this.eventId+"/"+from+"/"+to+"/"+sort_by+"/"+sort_order+"/"+search_filter)
    .subscribe(function(response){
      current.errorLog = false;
      current.eventSignedUpUsers = response;
    },function(err){
      current.errorLog = true;
    }
  );
  }
  getRegisteresUsersCount(){
    var current = this;
    this.http.get(this.serviceUrl+"/getRegisteredUsersCount/"+this.eventId)
  //  var response = this.pfService.getFormData(this.serviceUrl+"/geteventslistCount/"+filter_from+"/"+filter_to);

    .subscribe(function(response){
      current.length = response;
    });
  }
  sort(sortBy){
    if(this.sortOrder=='asc'){
      this.sortOrder='desc';
    }else {
      this.sortOrder = 'asc';
    }

    this.getUserDetails(this.page_from,this.pageSize,this.sortBy, this.sortOrder, this.search_filter);
  }

delete_user(id){
  var x = confirm("Are you sure you want to delete?");
  if (x){
    var current = this;
    this.http.get(this.serviceUrl+"/deleteRegistereduser/"+id)
     .subscribe(function(response){
        current.errorLog = false;
       current.getUserDetails(current.page_from,current.pageSize,current.sortBy, current.sortOrder,current.search_filter);
        current.length = response;
    
    },function(err){
      current.errorLog = true;
    });
  }else{
    return false;
  }


}

checkProducerAccess(pid){
  var current = this;
    if(this.producerId == pid){
      return true;
    }
      return false;
}

}
