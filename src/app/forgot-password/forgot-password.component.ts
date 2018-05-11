import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  constructor(
    private http:HttpClient,
    private router:Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
  }
  resetpwd(){
     var response = this.http.get("http://localhost:3000/resetpwd"+"/"+"ashkhan265731@gmail.com")
    .subscribe(function (res) {

      return res;
      });
  }

}
