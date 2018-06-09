import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { environment } from '../../environments/environment.prod';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})

export class ForgotPasswordComponent implements OnInit {
  serviceUrl = environment.serviceUrl;
  verifyEmail: any = false;
  email: any;
  resetpwdMsg: any = {
    type: '',
    message: ''
  };
  errMsg:any="";

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
  }
  resetpwd() {
    var current = this;
    var response = this.http.get("http://localhost:3000/resetpwd" + "/" + this.email)
    .subscribe(function (res) {
      if (res) {
        current.resetpwdMsg.type = "alert-success";
        current.resetpwdMsg.message = "Request Recieved Check Your Email to Reset Password!!";
      }
      return res;
    });
  }
  checkEmailDuplication(email) {
    var _this = this;
    var data = this.email;
    var response = this.http.post(this.serviceUrl + "/checkduplicates", { "data": data })
    .subscribe(function (res) {
      if (res) {
        _this.verifyEmail = true;
      } else {
        _this.verifyEmail = false;
      }
    });

  }
  goBack() {
    var current = this;
    current.router.navigate(["login"]);
  }

}
