import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
// import html2canvas from 'html2canvas';
// import { ErrorLogNotificationComponent } from './../../shared/error-log-notification/error-log-notification.component';
import { environment } from './../../../environments/environment';

// import * as jsPdf from 'jspdf';
declare var jsPDF: any;

@Component({
  selector: 'app-single-registereduser-details',
  templateUrl: './single-registereduser-details.component.html',
  styleUrls: ['./single-registereduser-details.component.css']
})
export class SingleRegistereduserDetailsComponent implements OnInit {
  serviceUrl = environment.serviceUrl;
  registerId: any = "";
  singleUserData: any = {};
  errorLog: any = false;
  base64Img: any = "";
  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.registerId = this.route.snapshot.params['id'];
    this.getSingleUserDetails();
  }
  getSingleUserDetails() {
    var current = this;
    this.http.get(this.serviceUrl + "/getSingleRegisteredUsersDetails/" + this.registerId)
      .subscribe(function (response) {
        current.errorLog = false;
        if (response && response[0]) {
          current.singleUserData = response[0];

          //For converting image to base 64
          if (current.singleUserData && current.singleUserData.user_id) {
            current.convertToBase64(current.serviceUrl + '/profile_pics/' + current.singleUserData.user_id.user_picture, function (myBase64) {
              current.base64Img = myBase64;
            });
          }

        }
      }, function (err) {
        current.errorLog = true;
      }
      );
  }

  /*
    ConvertToBase64 will take image url and callback function. It will load the image and convert it into base 64.
  */
  convertToBase64(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = function () {
      var reader = new FileReader();
      reader.onloadend = function () {
        callback(reader.result);
      };
      reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.send();
  }


  generate_pdf() {
    var _this = this;
    var doc = new jsPDF('p', 'pt');

    var header = function (data) {
      doc.setFontSize(18);
      doc.setTextColor(40);
      doc.setFontStyle('normal');
      doc.text("Rider Information Report", data.settings.margin.left, 50);
      if (_this.base64Img) {
        //Commented code for add image
        //doc.addImage(_this.base64Img, 'JPEG', 470, 30, 100, 100);
      }
    };

    var columns = ["", ""];
    var data = [
      ["User :", this.singleUserData.user_id.first_name + " " + this.singleUserData.user_id.last_name],
      ["Email :", this.singleUserData.user_id.email],
    ];

    var doc = new jsPDF('p', 'pt');
    doc.autoTable(columns, data, {
      startY: doc.autoTableEndPosY() + 70,
      pageBreak: 'auto',
      theme: 'plain',
      columnStyles: {
        0: {
          columnWidth: 100,
          halign: 'left'
        },
        1: {
          columnWidth: 470,
          halign: 'left'
        }
      },
      //beforePageContent: header,
      margin: { horizontal: 10, top: 10, bottom: 10 },
      showHeader: 'never',
      //headerStyles: { fillColor: [111, 167, 233], textColor: 20, display:hidden },
      styles: {
        overflow: 'linebreak',
        fontSize: 10,
        tableWidth: 280,
        columnWidth: 'auto',
        valign: 'middle',
        rowHeight: 20
      },
      drawHeaderRow: function (row, data) {
        row.height = 20;
      }
    });

    /*
    let startY = doc.autoTableEndPosY() + 70;
    doc.setFontSize(12);
    doc.text(20, startY, this.singleUserData.c_fname +" " +this.singleUserData.c_lname +"\n" +"Email:"+this.singleUserData.email);
    // doc.text(20, startY, this.singleUserData.c_lname);
    */

    doc.text("Race Class Type", 7, doc.autoTable.previous.finalY + 25);

    var res1 = doc.autoTableHtmlToJson(document.getElementById("table1"));

    doc.autoTable(res1.columns, res1.data, {
      //startY: doc.autoTableEndPosY() + 110,
      startY: doc.autoTable.previous.finalY + 40,
      pageBreak: 'auto',
      theme: 'grid',
      columnStyles: {
        0: {
          columnWidth: 250,
          halign: 'left'
        },
        1: {
          columnWidth: 170,
          halign: 'center'
        },
        2: {
          columnWidth: 150,
          halign: 'right'
        }
      },
      beforePageContent: header,
      margin: { horizontal: 10, top: 10, bottom: 10 },
      // headerStyles: { fillColor: [111, 167, 233], textColor: 20 },
      styles: {
        overflow: 'linebreak',
        fontSize: 10,
        tableWidth: 280,
        columnWidth: 'auto',
        valign: 'middle',
        rowHeight: 20
      },
      drawHeaderRow: function (row, data) {
        row.height = 20;
      }

    });

    doc.text("Exhibitions", 7, doc.autoTable.previous.finalY + 25);

    var res2 = doc.autoTableHtmlToJson(document.getElementById("table2"));
    doc.autoTable(res2.columns, res2.data, {
      //startY: doc.autoTableEndPosY() + 10,
      startY: doc.autoTable.previous.finalY + 40,
      pageBreak: 'auto',
      theme: 'grid',
      columnStyles: {
        0: {
          columnWidth: 250,
          halign: 'left'
        },
        1: {
          columnWidth: 170,
          halign: 'center'
        },
        2: {
          columnWidth: 150,
          halign: 'right'
        }
      },
      beforePageContent: header,
      margin: { horizontal: 10, top: 10, bottom: 10 },
      //  headerStyles: { fillColor: [111, 167, 233], textColor: 20 },
      styles: {
        overflow: 'linebreak',
        fontSize: 10,
        tableWidth: 280,
        columnWidth: 'auto',
        valign: 'middle',
        rowHeight: 20
      },
      drawHeaderRow: function (row, data) {
        row.height = 20;
      }

    });

    doc.text("Warmups", 7, doc.autoTable.previous.finalY + 25);

    var res3 = doc.autoTableHtmlToJson(document.getElementById("table3"));
    doc.autoTable(res3.columns, res3.data, {
      //startY: doc.autoTableEndPosY() + 10,
      startY: doc.autoTable.previous.finalY + 40,
      pageBreak: 'auto',
      theme: 'grid',
      columnStyles: {
        0: {
          columnWidth: 250,
          halign: 'left'
        },
        1: {
          columnWidth: 170,
          halign: 'center'
        },
        2: {
          columnWidth: 150,
          halign: 'right'
        }
      },
      beforePageContent: header,
      margin: { horizontal: 10, top: 10, bottom: 10 },
      // headerStyles: { fillColor:[111, 167, 233], textColor: 20 },
      styles: {
        overflow: 'linebreak',
        fontSize: 10,
        tableWidth: 280,
        columnWidth: 'auto',
        valign: 'middle',
        rowHeight: 20
      },
      drawHeaderRow: function (row, data) {
        row.height = 20;
      }

    });

    doc.text("Add Ons", 7, doc.autoTable.previous.finalY + 25);

    var res4 = doc.autoTableHtmlToJson(document.getElementById("table4"));
    doc.autoTable(res4.columns, res4.data, {
      //startY: doc.autoTableEndPosY() + 10,
      startY: doc.autoTable.previous.finalY + 40,
      pageBreak: 'auto',
      theme: 'grid',
      columnStyles: {
        0: {
          columnWidth: 250,
          halign: 'left'
        },
        1: {
          columnWidth: 170,
          halign: 'center'
        },
        2: {
          columnWidth: 150,
          halign: 'right'
        }
      },
      beforePageContent: header,
      margin: { horizontal: 10, top: 10, bottom: 10 },
      //headerStyles: { fillColor: [34, 168, 183], textColor: 20 },
      styles: {
        overflow: 'linebreak',
        fontSize: 10,
        tableWidth: 280,
        columnWidth: 'auto',
        valign: 'middle',
        rowHeight: 20
      },
      drawHeaderRow: function (row, data) {
        row.height = 20;
      }

    });

    var header = function (data) {
      doc.setFontSize(18);
      doc.setTextColor(40);
      doc.setFontStyle('normal');
      //doc.addImage(headerImgData, 'JPEG', data.settings.margin.left, 20, 50, 50);
      doc.text("Testing Report", data.settings.margin.left, 50);
    };

    var options = {
      beforePageContent: header,
      margin: {
        top: 80
      },
      startY: doc.autoTableEndPosY() + 20
    };

    doc.save("table.pdf");
    location.reload();
  }
}
