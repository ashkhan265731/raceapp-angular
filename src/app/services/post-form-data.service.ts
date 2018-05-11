import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class PostFormDataService {

  constructor(
    private http: HttpClient
  ) { }

  postFormData(url,data){
    return this.http.post(url,{data:data});
  }

  getFormData(url){
    return this.http.get(url);
  }
}
