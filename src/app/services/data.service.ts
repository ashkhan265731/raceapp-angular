import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class DataService {

  private messageSource = new BehaviorSubject<string>("default message");
  currentMessage = this.messageSource.asObservable();

  private messageSourceProfilePic = new BehaviorSubject<string>("profile pic");
  currentMessageProfilePic = this.messageSourceProfilePic.asObservable();

  private messageSourceProfileInfo = new BehaviorSubject<string>("profile info");
  currentMessageProfileInfo = this.messageSourceProfileInfo.asObservable();

  constructor() { }

  changeMessage(message: string) {
    this.messageSource.next(message)
  }

  updateProfilePic(message: string){
    this.messageSourceProfilePic.next(message);
  }

  updateProfileInfo(message: string){
    this.messageSourceProfileInfo.next(message);
  }

}