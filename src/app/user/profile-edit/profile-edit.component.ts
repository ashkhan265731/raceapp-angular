import { Router, ActivatedRoute, Params } from '@angular/router';
import { OnInit, Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder,  Validators } from '@angular/forms';
import { FileUpload } from 'ng2-fileupload';
import { FileUploader, FileSelectDirective } from 'ng2-file-upload';
import { PostFormDataService } from './../../services/post-form-data.service';
import { environment } from './../../../environments/environment';
import { Location } from '@angular/common';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css']
})
export class ProfileEditComponent implements OnInit {
  uploader: FileUploader;
  attachmentList: any = [];
  userId: String = '';
  userData: any = {};
  //states: any = [];
  modelData: any = {};
  //new variables
  isLinear = false;

  serviceUrl: any = environment.serviceUrl
  errorLog: any = false;




 states = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
  'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
  'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
  'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
  'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
  'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
];
selected = "Minnesota";

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private pfService: PostFormDataService,
    private router: Router,
    private _location: Location,
    private dataService: DataService
  ) {
    this.userId = this.route.snapshot.params['id'];
    this.uploader = new FileUploader({ url: this.serviceUrl+"/updateproducerpicture/profilepicture/" + this.userId });

    this.uploader.onCompleteItem = (item: any, response: any, status: any, header: any) => {
      response = JSON.parse(response);
      this.attachmentList.push(response);
      this.userData.user_picture = response['uploadname'];
      this.uploader.clearQueue();

      var user = JSON.parse(sessionStorage.getItem("user"));
      user.user_picture = response.uploadname;
      sessionStorage.removeItem('user');
      sessionStorage.setItem('user',JSON.stringify(user));

      this.dataService.updateProfilePic(response.uploadname);
      this.router.navigate(['user']);
  
    }

   }

  ngOnInit() {
    this.uploader.onAfterAddingFile = (file: any) => { file.withCredentials = false; };
    // get param
    this.userId = this.route.snapshot.params['id'];
    this.getUserDetails();
    
    this.userData.user_picture = this.userId+".jpg";


  }

  onUploadFiles(evt: any) {
    if (evt.error) {
      throw evt.error;
    }
    const files = evt.files;
  }

  getUserDetails() {
    var current = this;
    this.http.get(this.serviceUrl+"/getuserdetails/" + this.userId)
      .subscribe(function (response) {
        current.userData = response;
      });
  }

  update(model: any) {
    var current= this;
    this.modelData = Object.assign({}, this.userData);
    this.modelData.id = this.userId;
    this.http.post(this.serviceUrl+"/updateuser", this.modelData)
      .subscribe(function (response) {
        current.errorLog = false;
        var user = JSON.parse(sessionStorage.getItem('user'));
        user.first_name = response['first_name'];
        user.last_name = response['last_name'];
        sessionStorage.removeItem('user');
      sessionStorage.setItem('user',JSON.stringify(user));
        current.dataService.updateProfileInfo(user.first_name);
        current.router.navigate(['user']);
    },function(err){
      current.errorLog = true;
    });
  }
  navigateBack() {
    this._location.back();
}

}