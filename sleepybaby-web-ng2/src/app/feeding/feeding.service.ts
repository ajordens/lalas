import {Injectable} from '@angular/core';
import {Headers, Http, Response} from '@angular/http';

import 'rxjs/add/operator/toPromise';

import {FeedingAggregate} from './feeding-aggregate';
import {ExceptionHandlerService} from "../exceptions/exception-handler.service";

@Injectable()
export class FeedingService {
  private feedingsUrl = '/api/feedings/';

  constructor(private http: Http, private exception: ExceptionHandlerService) {
  }

  getFeedingsByDay(): Promise<Array<FeedingAggregate>> {
    let headers = new Headers({
      'Content-Type': 'application/json'
    });

    let currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      headers.append('Authorization', JSON.parse(currentUser).token)
    }

    return this.http
      .get(this.feedingsUrl + '/byDay', {'headers': headers})
      .toPromise()
      .then(res => res.json().result.feedingSummariesByDay)
      .catch(this.handleError.bind(this));
  }

  getFeedingsByTime(): Promise<Array<FeedingAggregate>> {
    let headers = new Headers({
      'Content-Type': 'application/json'
    });

    let currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      headers.append('Authorization', JSON.parse(currentUser).token)
    }

    return this.http
      .get(this.feedingsUrl + '/byTime', {'headers': headers})
      .toPromise()
      .then(res => res.json().result.feedingSummariesByTime)
      .catch(this.handleError.bind(this));
  }

  private handleError(error: any): Promise<any> {
    return this.exception.handleTransportError(error);
  }
}
