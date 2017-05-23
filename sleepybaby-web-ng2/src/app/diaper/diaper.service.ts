import {Injectable} from '@angular/core';
import {Headers, Http, Response} from '@angular/http';

import 'rxjs/add/operator/toPromise';

import {DiaperAggregate} from './diaper-aggregate';
import {ExceptionHandlerService} from "../exceptions/exception-handler.service";

@Injectable()
export class DiaperService {
  private diapersUrl = '/api/diapers/';

  constructor(private http: Http, private exception: ExceptionHandlerService) {
  }

  getDiapersByDay(): Promise<Array<DiaperAggregate>> {
    let headers = new Headers({
      'Content-Type': 'application/json'
    });

    let currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      headers.append('Authorization', JSON.parse(currentUser).token)
    }

    return this.http
      .get(this.diapersUrl + '/byDay', {'headers': headers})
      .toPromise()
      .then(res => res.json().result.diaperSummariesByDay)
      .catch(this.handleError.bind(this));
  }

  private handleError(error: any): Promise<any> {
    return this.exception.handleTransportError(error);
  }
}
