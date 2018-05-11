import { Injectable } from '@angular/core';

@Injectable()
export class SyncHttpService {

  constructor() { }

  synchronousHttp(serviceUrl){
    var response;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
       response = this.responseText;
      }
    };
    xhttp.open("GET", serviceUrl, false);
    xhttp.send();

    return response;
  }

}
