import { Router, ActivatedRoute, Params } from '@angular/router';
import { OnInit, Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder,  Validators } from '@angular/forms';
import { FileUpload } from 'ng2-fileupload';
import { FileUploader, FileSelectDirective } from 'ng2-file-upload';
import { PostFormDataService } from './../../services/post-form-data.service';
import { environment } from './../../../environments/environment';


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
  ) {
    this.userId = this.route.snapshot.params['id'];
     console.log(this.userId);
    this.uploader = new FileUploader({ url: this.serviceUrl+"/updateproducerpicture/profilepicture/" + this.userId });

    this.uploader.onCompleteItem = (item: any, response: any, status: any, header: any) => {
      response = JSON.parse(response);
      this.attachmentList.push(response);
      console.log(response);
      this.userData.user_picture = response['uploadname'];
      this.uploader.clearQueue();

    }

   }

  ngOnInit() {
    this.uploader.onAfterAddingFile = (file: any) => { file.withCredentials = false; };
    // get param
    this.userId = this.route.snapshot.params['id'];
    this.getUserDetails();
    
    this.userData.user_picture = this.userId+".jpg";
    // this.firstFormGroup = this._formBuilder.group({
    //   first_name: ['', Validators.required,Validators.minLength(2), Validators.pattern("[a-zA-Z _]*")],
    //   last_name: ['', Validators.required],
    //   email: ['', Validators.required],
    //   phone: ['', Validators.required],
   
    //   addline1: ['', Validators.required],
    //   addline2: ['', Validators.required],
    //   city: ['', Validators.required],
    //   state: [this.selected, Validators.required],
    //   zipcode: ['', Validators.required]
    // });

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
    console.log(this.userData);
    this.http.post(this.serviceUrl+"/updateuser", this.modelData)
      .subscribe(function (response) {
        current.errorLog = false;
    },function(err){
      current.errorLog = true;
    });
  }

}