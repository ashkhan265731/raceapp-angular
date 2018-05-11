import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SyncHttpService } from './sync-http.service';
import { Router } from '@angular/router';
import { environment } from './../../environments/environment.prod';


@Injectable()
export class LoginService {
  serviceUrl = environment.serviceUrl;

  constructor(
    private http: HttpClient,
    private syncHttpService: SyncHttpService,
    private router: Router
  ) { }

  isLoggedIn() {

    var urlPath = window.location.href.toString().split(window.location.host)[1];
    var loginType = urlPath.split("/");
    var userType;

    var session = JSON.parse(sessionStorage.getItem("user"));
    if (session) {

      if (loginType[1] == "login") {
        userType = session.user_type;
      } else {
        userType = loginType[1];
      }

      if(!userType){
        userType = '';
      }
      return true;

      // var response = this.syncHttpService.synchronousHttp(this.serviceUrl +'/'+ session._id + "/" + userType);

      // if (response) {
      //   response = JSON.parse(response);
      //   if (response != null && response._id == session._id && response.user_type == session.user_type) {
      //     return true;
      //   } else {
      //     return false;
      //   }
      // } else {
      //   return false;
      // }
    } else {
      return false;
    }


  }
}
