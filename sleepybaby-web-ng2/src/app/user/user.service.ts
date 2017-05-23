import {Injectable} from '@angular/core';
import {Headers, Http, Response} from '@angular/http';

import 'rxjs/add/operator/toPromise';

import {User} from './user';
import {ExceptionHandlerService} from "../exceptions/exception-handler.service";

@Injectable()
export class UserService {
  private usersUrl = '/api/users/';  // URL to web api

  constructor(private http: Http,
              private exceptionHandler: ExceptionHandlerService) {
  }

  getCurrent(): Promise<User> {
    let headers = new Headers({
      'Content-Type': 'application/json'
    });

    let currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      headers.append('Authorization', JSON.parse(currentUser).token)
    }

    return this.http
      .get(this.usersUrl + '/me', {'headers': headers})
      .toPromise()
      .then(res => res.json().result.me)
      .catch(this.handleError.bind(this));
  }

  private handleError(error: any): Promise<any> {
    return this.exceptionHandler.handleTransportError(error);
  }
}
