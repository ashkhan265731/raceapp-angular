import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs/Rx";
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService } from './../services/alert.service';
import { environment } from './../../environments/environment.prod';
import { Location } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  serviceUrl = environment.serviceUrl;
  user: any = {};
  filesToUpload: Array<File> = [];
  selectedTab = 0;
  verifyEmail:any = false;

  states = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
    'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
    'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
    'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
    'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
    'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
    'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
  ];
  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private location: Location
  ) { }

  ngOnInit() {
  }
  checkEmailDuplication(email){
    var _this = this;
    var data = email.model; 
    // console.log(email.model);
    var response = this.http.post(this.serviceUrl+"/checkduplicates", {"data":data})
      .subscribe(function (res) {
      if(res){
        _this.verifyEmail = true;
      }else{
        _this.verifyEmail = false;
      }
    });

  }

  fileChangeEvent(fileInput: any) {
    this.filesToUpload = <Array<File>>fileInput.target.files;
  }

  register() {
    this.user  = JSON.stringify(this.user);
    const formData: any = new FormData();
    const files: Array<File> = this.filesToUpload;
if(files.length>0){
  formData.append("uploads[]", files[0], files[0]['name']);
}
else{
 
}

    //formData.append("uploads[]", files[0], files[0]['name']);
    formData.append("user",this.user)

  var response = this.http.post(this.serviceUrl+"/registeruser", formData)
      .subscribe(function (res) {
        console.log(response);
        return res;
      });

    if (response) {
      this.user = {};
      this.router.navigate(["login"]);
      location.reload();
      this.alertService.success('Registered successfully ', true);
    }
    else{
      this.alertService.error('Something went wrong, Please Contact the administrator !!', true);
    }
  }
}
