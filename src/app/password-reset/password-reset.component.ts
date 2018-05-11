import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent implements OnInit {
  emailId :any ="";
  token: any = "";
  validatedEmail :boolean = false;
  newpass : any = "";

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    var _this = this;
    this.emailId = this.route.snapshot.params['email'];
    this.token = this.route.snapshot.params['token'];
    var response = this.http.get("http://localhost:3000/validateToken"+"/"+this.emailId+"/"+this.token)
    .subscribe(function (res) {
      if(res){
        console.log("token matches");
        _this.validatedEmail = true;
        
      }
      return res;
      });
  }
  newpwd(){
    var _this = this;

    var response = this.http.get("http://localhost:3000/createNewPass"+"/"+this.emailId+"/"+this.token+"/"+this.newpass)
    .subscribe(function (res) {
      _this.router.navigate(["login/0"]);

      return res;
      });
  }

}
