import { Component, OnInit } from '@angular/core';
import { DashboardComponent } from './../dashboard/dashboard.component';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { PostFormDataService } from './../../services/post-form-data.service';
import { environment } from './../../../environments/environment';


@Component({
  selector: 'app-raceclasstype',
  templateUrl: './raceclasstype.component.html',
  styleUrls: ['./raceclasstype.component.css']
})
export class RaceclasstypeComponent implements OnInit {
  serviceUrl = environment.serviceUrl;
  raceClassData: any = {};
  message: any;
  raceClassDataReponse: any;
  selectedAll: any;
  enableDelete: any = false;
  enableEdit: any = false;
  editRaceId: any;
  updateRaceClassData: any = [];
  errorLog: any = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private pfService: PostFormDataService,
  ) { }

  ngOnInit() {
    this.getRaceClassType();
  }
  addRaceClassType() {
    var current = this;
    var response = this.http.post(this.serviceUrl+"/addraceclasstype", this.raceClassData)
      //var response = this.pfService.postFormData(this.serviceUrl+"/addraceclasstype",this.raceClassData);
      .subscribe(function (res) {
        current.errorLog = false;
        current.getRaceClassType();
        //
        current.message = "data inserted successfully";
        current.raceClassData = {};
        current.getRaceClassType();
      },
        function (err) {
          current.errorLog = true;
        }

      );

    // if (response) {
    //   this.message = "data inserted successfully";
    //   this.raceClassData = {};
    //   this.getRaceClassType();
    // }

  }

  getRaceClassType() {
    var current = this;
    // this.http.get("http://localhost:3000/getraceclasstype")
    var response = this.pfService.getFormData(this.serviceUrl + '/getraceclasstype/');
    response.subscribe(
      function (response) {
        current.errorLog = false;
        current.raceClassDataReponse = response;
        console.log(response);
        console.log("false");
      },
      function (err) {
        current.errorLog = true;
        console.log("true");
        // console.log(err);
        // console.log(err.message);
        // console.log(err['HttpErrorResponse']);
      }
    );
  }
  //delete raceClassType
  deleteRaceClass(id) {

    var ids = [];
    for (var i = 0; i < this.raceClassDataReponse.length; i++) {
      if (this.raceClassDataReponse[i].selected) {
        ids.push(this.raceClassDataReponse[i]._id);
      }
    }
    var current = this;
    this.http.post(this.serviceUrl+"/deleteraceclass", { data: ids })
      //var response = this.pfService.postFormData(this.serviceUrl+"/deleteraceclass",{data:ids});
      .subscribe(function (response) {
        current.errorLog = false;
        current.getRaceClassType();
        current.enableDelete = false;

      },
        function (err) {
          current.errorLog = true;
        })
  }

  selectAll() {
    var count = 0;
    for (var i = 0; i < this.raceClassDataReponse.length; i++) {
      this.raceClassDataReponse[i].selected = this.selectedAll;
      if (this.raceClassDataReponse[i].selected) {
        count++
      }
    }
    if (count > 0) {
      this.enableDelete = true;
    } else {
      this.enableDelete = false;
    }

  }

  checkIfAllSelected() {
    this.selectedAll = this.raceClassDataReponse.every(function (item: any) {
      return item.selected == true;
    })

    var count = 0;
    for (var i = 0; i < this.raceClassDataReponse.length; i++) {
      if (this.raceClassDataReponse[i].selected) {
        count++
      }
    }
    if (count > 0) {
      this.enableDelete = true;
    } else {
      this.enableDelete = false;
    }
  }

  //edit 
  editraceclasstype(id) {
    this.enableEdit = true;
    this.editRaceId = id;
  }

  saveraceclasstype(id, rc_name) {
    var updateObject = {
      id: id,
      name: rc_name
    }

    var current = this;
    //var res = this.pfService.postFormData(this.serviceUrl+"/updateraceclass", JSON.stringify(updateObject));
    this.http.post(this.serviceUrl+"/updateraceclass", updateObject)
      .subscribe(function (response) {
        current.errorLog = false;
        current.getRaceClassType();
        current.enableEdit = false;
    
      },
      function (err) {
        current.errorLog = true;
      })
  }


}
