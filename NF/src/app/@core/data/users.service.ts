import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import * as decode from 'jwt-decode';
let counter = 0;

@Injectable()
export class UserService {
  token_Payload = decode(localStorage.getItem('auth_app_token'));

  constructor() {
    // this.userArray = Object.values(this.users);
  }

  
  getUser() {
    return decode(localStorage.getItem('auth_app_token')).name; 
  }
}
