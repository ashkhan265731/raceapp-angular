import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, CanActivateChild } from '@angular/router';
import { LoginService } from './login.service';

@Injectable()
export class AuthGuardService implements CanActivate, CanActivateChild {
  constructor(private loginService: LoginService, private router: Router) {
  }

  canActivate() {
    console.log(this.router.url);
    var isLoggedIn = this.loginService.isLoggedIn();
    if(!isLoggedIn){
      console.log("inside login")
      this.router.navigate(["home"]);
      return isLoggedIn;
    }
    return isLoggedIn;
    
  }

  canActivateChild() {
    console.log(this.router.url);
    var isLoggedIn = this.loginService.isLoggedIn();
    if(!isLoggedIn){
      console.log("inside login")
      this.router.navigate(["home"]);
      return isLoggedIn;
    }
    return isLoggedIn;
    
  }
}

