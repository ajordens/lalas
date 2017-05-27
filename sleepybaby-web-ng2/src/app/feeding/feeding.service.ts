import {Injectable} from '@angular/core';
import {Headers, Http, Response} from '@angular/http';

import 'rxjs/add/operator/toPromise';

import {ExceptionHandlerService} from "../exceptions/exception-handler.service";
import {FeedingSummary} from "./feeding-summary";

@Injectable()
export class FeedingService {
  private feedingsUrl = '/api/feedings/';

  constructor(private http: Http, private exception: ExceptionHandlerService) {
  }

  getFeedingsByDay(): Promise<Array<FeedingSummary>> {
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

  getFeedingsForDay(date): Promise<FeedingSummary> {
    let headers = new Headers({
      'Content-Type': 'application/json'
    });

    let currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      headers.append('Authorization', JSON.parse(currentUser).token)
    }

    return this.http
      .get(this.feedingsUrl + '/byDay/' + date, {'headers': headers})
      .toPromise()
      .then(res => {
        let result = res.json().result;
        let summary = result.feedingSummaryByDay;
        summary.feedings = result.feedings;
        return summary;
      })
      .catch(this.handleError.bind(this));
  }

  getFeedingsByTime(): Promise<Array<FeedingSummary>> {
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
