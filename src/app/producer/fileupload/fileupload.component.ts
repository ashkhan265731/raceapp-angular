import { Component, OnInit, Input } from '@angular/core';
import { FileUpload } from 'ng2-fileupload';
import { FileUploader, FileSelectDirective } from 'ng2-file-upload';
import { $ } from 'protractor';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from './../../../environments/environment';

@Component({
  selector: 'app-fileupload',
  templateUrl: './fileupload.component.html',
  styleUrls: ['./fileupload.component.css']
})
export class FileuploadComponent implements OnInit {
  serviceUrl = environment.serviceUrl;

  @Input('eventId') eventId: String;
  uploader:FileUploader;
    attachmentList:any = [];
  
    
    constructor(
      private router: Router,
      private route: ActivatedRoute
    ) { 
      this.eventId = this.route.snapshot.params['id'];
       this.uploader= new FileUploader({url:this.serviceUrl+"/uploadfiles/event/"+this.eventId});
      
      this.uploader.onCompleteItem = (item:any, response: any, status: any, header: any)=>{
         this.attachmentList.push(JSON.parse(response));
          router.navigate(["/event_details",this.eventId]);
         
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