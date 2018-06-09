import { Component, Input, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from './../../../environments/environment';
import { DataService } from '../../services/data.service';

// import * as jsPdf from 'jspdf';
declare var jsPDF: any;



@Component({
  selector: 'app-registered-users-report',
  templateUrl: './registered-users-report.component.html',
  styleUrls: ['./registered-users-report.component.css']
})
export class RegisteredUsersReportComponent implements OnInit {
  @Output() alert: EventEmitter<any> = new EventEmitter();
  serviceUrl = environment.serviceUrl;

  errorLog: any = false;
  alertMessage: any = null;

  filter_from: any = Date.parse("1900-01-01T06:00:00.000Z");
  filter_to: any = Date.parse("2040-01-01T06:00:00.000Z");
  searchCriteria: any = {
    searchName: "",
    searchValue: ""
  };


  // For example initialize to specific date (09.10.2018 - 19.10.2018). It is also possible
  // to set initial date range value using the selDateRange attribute.
  private model: any = {
    beginDate: { year: 2010, month: 10, day: 9 },
    endDate: { year: 2040, month: 10, day: 19 }
  };


  searchNameOption = [
    { value: 'user_firstname', viewValue: 'User First Name' },
    { value: 'user_lastname', viewValue: 'User Last Name' },
    { value: 'email', viewValue: 'User Email' },
    { value: 'ridetype', viewValue: 'Ride Class Type' },
    { value: 'ridername', viewValue: 'Rider Name' },
    { value: 'horsename', viewValue: 'Horse Name' },
    { value: 'event_name', viewValue: 'Event Name' }

  ];
  allEventsEntryUsers: any = [];
  eventsEntryUsers: any = [];
  entryList: any = {};
  usersReportData: any = [];
  usersReportFilterData: any = [];

  from_date: any = { year: 2010, month: 10, day: 9 };
  to_date: any = { year: 2040, month: 10, day: 19 };
  constructor(
    private http: HttpClient,
    private router: Router,
    private dataService: DataService
  ) {
    this.dataService.changeMessage("event_report");

  }

  ngOnInit() {
  

    // console.log("model" + this.model);
    this.entryList = JSON.stringify(this.eventsEntryUsers);
    // console.log(this.entryList);
    this.getEventEntriesUsers();
    this.getAllEventEntriesUsers();

    //this.filter();

  }

  dateFilter() {


    if (this.from_date && this.to_date) {

      // console.log(this.from_date);
      // console.log(this.to_date);

      // var fromdate = this.from_date;

      // this.from_date = new Date(fromdate.month + "," + fromdate.day + "," + fromdate.year);

      // var todate = this.to_date;
      // this.to_date = new Date(todate.month + "," + todate.day + "," + todate.year);

    }


  }

  // some
  generate() {

    var doc = new jsPDF('p', 'pt');

    var res = doc.autoTableHtmlToJson(document.getElementById("basic-table"));
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




  usersReportDataFilter() {
    var searchBy = this.searchCriteria.searchName;
    var searchValue = this.searchCriteria.searchValue;
    var search_fromdate = this.model;



    var fromdate = this.from_date;
    fromdate = new Date(fromdate.month + "," + fromdate.day + "," + fromdate.year);

    var todate = this.to_date;
    todate = new Date(todate.month + "," + todate.day + "," + todate.year);

    this.filter_from = Date.parse(fromdate);
    this.filter_to = Date.parse(todate);




    fromdate = Date.parse(fromdate);
    todate = Date.parse(todate);



    var result = this.usersReportFilterData.filter(function (el, index) {
      // console.log(searchBy);
      // console.log(searchValue);
      // console.log(el);
      if (searchValue != "") {
        if (searchBy == "ridetype") {
          return el[searchBy][0] == searchValue && el.event_fromdate >= fromdate && el.event_todate <= todate;
        }
        else {
          return el[searchBy] == searchValue && el.event_fromdate >= fromdate && el.event_todate <= todate;
        }
      } else {
        return el.event_fromdate >= fromdate && el.event_todate <= todate;
      }

    });


    this.usersReportData = result;

    // console.log(this.usersReportData);




  }

  getAllEventEntriesUsers() {
    var current = this;
    this.http.get(this.serviceUrl + "/getAllRegisteredUsersDetails")
      .subscribe(function (response) {
        current.errorLog = false;
        current.allEventsEntryUsers = response;
        // console.log(current.allEventsEntryUsers);
        current.allEventsEntryUsers.forEach((el, index) => {
          if (el.event_id && el.user_id) {
            for (var i = 0; i < el.racetypeList.length; i++) {
              el.racetypeList[i].user_firstname = el.user_id.first_name;
              el.racetypeList[i].user_lastname = el.user_id.last_name;
              el.racetypeList[i].event_name = el.event_id['event_name'];
              el.racetypeList[i].event_fromdate = el.event_id.from_date;
              el.racetypeList[i].event_todate = el.event_id.to_date;
              current.usersReportData.push(el.racetypeList[i]);
              current.usersReportFilterData.push(el.racetypeList[i]);
            }
          }
        });
      }, function (err) {
        current.errorLog = true;
      }

      );
  }


  getEventEntriesUsers() {
    var fromdate = this.model.beginDate;
    fromdate = new Date(fromdate.month + "," + fromdate.day + "," + fromdate.year);
    var todate = this.model.endDate;
    todate = new Date(todate.month + "," + todate.day + "," + todate.year);

    var filter_from = Date.parse(fromdate);
    var filter_to = Date.parse(todate);

    var current = this;
    var searchName = this.searchCriteria.searchName ? this.searchCriteria.searchName : null;
    var searchValue = this.searchCriteria.searchValue ? this.searchCriteria.searchValue : null;

    this.http.get(this.serviceUrl + "/getevententriesusers/" + searchName + "/" + searchValue + "/" + filter_from + "/" + filter_to)
      .subscribe(function (response) {
        current.errorLog = false;
        current.eventsEntryUsers = response;
      }, function (err) {
        current.errorLog = true;
        current.alertMessage = {
          type: 'danger',
          title: 'Something Went wrong. Please Contact Administartor',
          data: err
        };
      }
      );
  }

  print_instant() {
    //window.print();
  }

  print(event) {

    // var jspdf = new jsPdf();
    // jspdf.setFontSize(5);
    // jspdf.fromHTML(html,10,10);
    // jspdf.save("test.pdf");

    //var pdf = new jsPdf('landscape', 'pt', 'letter');
    var pdf = new jsPDF('landscape', 'pt', 'letter');
    pdf.rect(200, 200, 10, 10);
    pdf.setFont("times", "normal");



    var source = document.getElementById("riders").outerHTML;
    // source can be HTML-formatted string, or a reference
    // to an actual DOM element from which the text will be scraped.


    // we support special element handlers. Register them with jQuery-style 
    // ID selector for either ID or node name. ("#iAmID", "div", "span" etc.)
    // There is no support for any other type of selectors 
    // (class, of compound) at this time.
    var specialElementHandlers = {
      // element with id of "bypass" - jQuery style selector
      '#bypassme': function (element, renderer) {
        // true = "handled elsewhere, bypass text extraction"
        return true
      }
    };
    var margins = {
      top: 30,
      bottom: 30,
      left: 30,
      width: '100%'
    };

    // all coords and widths are in jsPDF instance's declared units
    // 'inches' in this case

    pdf.fromHTML(
      source, // HTML string or DOM elem ref.
      margins.left, // x coord
      margins.top, { // y coord
        'width': margins.width, // max width of content on PDF
        'elementHandlers': specialElementHandlers
      },


      function (dispose) {
        // dispose: object with X, Y of the last line add to the PDF 
        //          this allow the insertion of new lines after html
        pdf.save('report.pdf');
      }, margins);
  }
}
