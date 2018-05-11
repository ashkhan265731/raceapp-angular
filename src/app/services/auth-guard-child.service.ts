import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { LoginService } from './login.service';

@Injectable()
export class AuthGuardChildService {

  constructor( private loginService : LoginService, private router : Router ) {
  }
  CanActivateChild( route : ActivatedRouteSnapshot, state : RouterStateSnapshot ) {
    console.log(this.loginService.isLoggedIn());
    if(this.loginService.isLoggedIn()) {
      return true;
    }
     else{
      this.router.navigate(["login"]);
     }
  }
}
