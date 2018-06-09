import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from './../../../environments/environment';

// import * as jsPdf from 'jspdf';
declare var jsPDF: any;

@Component({
  selector: 'app-user-report-by-event-category',
  templateUrl: './user-report-by-event-category.component.html',
  styleUrls: ['./user-report-by-event-category.component.css']
})
export class UserReportByEventCategoryComponent implements OnInit {
  serviceUrl = environment.serviceUrl;
  errorLog:any = false;
  eventSignedUpUsers:any={};
  usersReportData:any;
  eventId:any="";
  seachValue:any = "";
  searchType:any = "";
  userName:any = "";
  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {

    this.eventId = this.route.snapshot.params['eid'];
    this.seachValue =this.route.snapshot.params['searchvalue'];
    this.searchType =this.route.snapshot.params['searchtype'];
    this.filterUserReport(this.seachValue,this.searchType);
  }

  filterUserReport(seachValue,searchType){
    var current = this;
    this.http.get(this.serviceUrl+"/getRegisteredUsersForEvent/"+this.eventId)
    .subscribe(function(response){
      current.errorLog = false;
      current.eventSignedUpUsers = response;
      console.log(current.eventSignedUpUsers);
      var result = current.eventSignedUpUsers.filter(function (el, index) {
        if(searchType == 'raceclass'){
        for( var x=0; x<=el.racetypeList.length; x++ ){
          return el.racetypeList[x].ridetype[0]==seachValue;
        }
      }
      else if(searchType == 'exhibition'){
        for( var x=0; x<=el.etimeslots.length; x++ ){
        return el.etimeslots[x].exhibition_day == seachValue;
        }
      }
      else if(searchType == 'warmup'){
        for( var x=0; x<=el.wtimeslots.length; x++ ){
          return el.wtimeslots[x].warmup_day == seachValue;
          }
        }
      else if(searchType == 'stalls'){
        return el.userStalls>=1;
      }
      else if(searchType == 'e_hookup'){
        return el.electric_quantity>=1;
      }
      else if(searchType == 'shavings'){
        return el.shavings_quantity>=1;
      }
    
    })

    current.usersReportData= result;
    
    },function(err){
      current.errorLog = true;
    }
  );
  }
 // some
 generate() {

  var doc = new jsPDF('p', 'pt');

  var res = doc.autoTableHtmlToJson(document.getElementById("report-table"));
  //doc.autoTable(res.columns, res.data, {margin: {top: 80}, theme: 'grid'});

  var header = function (data) {
    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.setFontStyle('normal');
    //doc.addImage(headerImgData, 'JPEG', data.settings.margin.left, 20, 50, 50);
    doc.text("Report", data.settings.margin.left, 50);
  };

  var options = {
    beforePageContent: header,
    margin: {
      top: 80
    },
    startY: doc.autoTableEndPosY() + 20
  };

  // doc.autoTable(res.columns, res.data, options);
  doc.autoTable(res.columns, res.data, { beforePageContent: header, margin: { top: 80 }, theme: 'grid' });
  doc.save("table.pdf");
}
//some

  print_instant() {
    window.print();
  }



}
