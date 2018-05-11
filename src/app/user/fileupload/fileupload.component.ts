import { Component, OnInit } from '@angular/core';
import { FileUpload } from 'ng2-fileupload';
import { FileUploader, FileSelectDirective } from 'ng2-file-upload';
import { environment } from './../../../environments/environment';

@Component({
  selector: 'app-fileupload',
  templateUrl: './fileupload.component.html',
  styleUrls: ['./fileupload.component.css'],
  
})

export class FileuploadComponent implements OnInit {
  serviceUrl = environment.serviceUrl;


  uploader:FileUploader = new FileUploader({url:this.serviceUrl+"/uploadfiles/usersignup/10"});

  attachmentList:any = [];

  
  
  constructor() { 

    //console.log(this.uploader.queue);
    //this.uploader.uploadAll();

    this.uploader.onCompleteItem = (item:any, response: any, status: any, header: any)=>{
      this.attachmentList.push(JSON.parse(response));
      console.log(response);
      console.log(this.attachmentList);
    }
  }

  ngOnInit() {
  }
  onUploadFiles(evt: any) {
    if (evt.error) {
        throw evt.error;
    }

    const files = evt.files;
    // You can run upload script here
  }


}
