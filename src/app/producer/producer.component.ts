import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { DataService } from './../services/data.service';


@Component({
  selector: 'app-producer',
  templateUrl: './producer.component.html',
  styleUrls: ['./producer.component.css']
})
export class ProducerComponent implements OnInit {
  serviceUrl = environment.serviceUrl;
  userData: any = {};
  userid: String;
  fname: String;
  lname: String;
  user_picture: String;
  pageTitle:any = 'dashboard';
  constructor(
    private router: Router,
    private http: HttpClient,
    private route: ActivatedRoute,
    private dataService: DataService
  ) {
    var _this = this;
    this.dataService.currentMessage.subscribe(function(data){
      console.log(data);
      _this.pageTitle = data;
    })
   }

  ngOnInit() {
    this.userid = JSON.parse(sessionStorage.getItem('user'))._id;
    this.fname = JSON.parse(sessionStorage.getItem('user')).first_name;
    this.lname = JSON.parse(sessionStorage.getItem('user')).last_name;
    this.user_picture = JSON.parse(sessionStorage.getItem('user')).user_picture;
    this.getUserDetails();
  }
  getUserDetails() {
    var current = this;
    this.http.get(this.serviceUrl + "/getuserdetails/" + this.userid)
      .subscribe(function (response) {
        // console.log("inside userdetails");
        current.userData = response;
      });
  }

  logout() {
    sessionStorage.removeItem("user");
    this.router.navigate(["login"]);
  }


}