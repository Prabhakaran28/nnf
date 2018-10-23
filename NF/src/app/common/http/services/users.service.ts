import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import * as decode from 'jwt-decode';

@Injectable()
export class UserService {
  token_Payload = decode(localStorage.getItem('auth_app_token'));

  getUserName() {
    return this.token_Payload.name; 
  }
}
