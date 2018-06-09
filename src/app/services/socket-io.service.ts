import { Injectable } from '@angular/core';

import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';


@Injectable()
export class SocketIoService {

  private url = 'http://localhost:3000';  
  private socket;
  
  sendMessage(message){
    console.log(typeof message);
    message = JSON.parse(message);
    console.log(typeof message);
    this.socket.emit('add-message', message);    
  }
  
  getMessages() {
    let observable = new Observable(observer => {
      this.socket = io(this.url);
      this.socket.on('Updated Fields', (data) => {
        console.log(data);
        console.log(typeof data);
        observer.next(data);    
      });
      return () => {
        this.socket.disconnect();
      };  
    })     
    return observable;
  }  
}
