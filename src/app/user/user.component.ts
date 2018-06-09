import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  serviceUrl = environment.serviceUrl;
  userData: any = {};
  userid: String;
  fname: String;
  lname: String;
  user_picture: String;
  pageTitle: any = 'dashboard';

  constructor(
    private router: Router,
    private http: HttpClient,
    private route: ActivatedRoute,
    private dataService: DataService

  ) {
    var user = JSON.parse(sessionStorage.getItem("user"));
    this.userData.first_name = user.first_name;
    this.userData.last_name = user.last_name;
    var _this = this;
    this.dataService.currentMessage.subscribe(function (data) {
      console.log(data);
      _this.pageTitle = data;
    });

    this.dataService.currentMessageProfilePic.subscribe(function (data) {
      if (data != 'profile pic') {
        _this.user_picture = data;
        setTimeout(() => {
          _this.router.navigate(['user/profile', user._id]);
        }, 0)
      }
    });

    this.dataService.currentMessageProfileInfo.subscribe(function (data) {
      if (data != 'profile info') {
        setTimeout(() => {
          _this.router.navigate(['user/profile', user._id]);
        }, 0)
      }

    });

  }

  ngOnInit() {
    this.userid = JSON.parse(sessionStorage.getItem('user'))._id;
    this.fname = JSON.parse(sessionStorage.getItem('user')).first_name;
    this.lname = JSON.parse(sessionStorage.getItem('user')).last_name;
    this.user_picture = JSON.parse(sessionStorage.getItem('user')).user_picture;
    this.getUserDetails();



  }

  componentAdded() {
    var user = JSON.parse(sessionStorage.getItem("user"));
    this.userData.first_name = user.first_name;
    this.userData.last_name = user.last_name;
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
