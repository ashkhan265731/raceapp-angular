import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs/Rx";
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService } from './../services/alert.service';
import { environment } from './../../environments/environment.prod';
import { Location } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  serviceUrl = environment.serviceUrl;
  loginUser: any = {};
  loginMsg:any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private location: Location
  ) { }

  ngOnInit() {
  }

  login() {
    var current = this;
    var res = this.http.post(this.serviceUrl+"/loginuser", this.loginUser)
      .subscribe(function (loginResponse) {
        current.router.navigate(["producer"]);
        if (loginResponse != null) {
          current.alertService.success('Login successful', true);
          if (typeof (Storage) !== "undefined") {
            sessionStorage.setItem("user", JSON.stringify(loginResponse));
          }
          var user = JSON.parse(sessionStorage.getItem("user"));
          if (user.user_type == "producer") {
            current.router.navigate(["producer"]);
          }
          else if (user.user_type == "user") {
            current.router.navigate(["user"]);
          }
          else {
            current.router.navigate(["home"]);
          }
        } else {
          current.router.navigate(["login"]);
          current.loginMsg = "Username or password is incorrect";
          //current.alertService.error('Username or password is incorrect', true);
        }
      });
  }

}
