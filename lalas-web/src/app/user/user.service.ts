/*
 * Copyright 2017 Adam Jordens
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { User } from './user';

@Injectable()
export class UserService {
  private usersUrl = '/api/users/';  // URL to web api

  constructor(private http: Http) { }

  getCurrent(): Promise<User> {
    return this.http
      .get(this.usersUrl + '/me')
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  // // Add new Hero
  // private post(hero: Hero): Promise<Hero> {
  //   let headers = new Headers({
  //     'Content-Type': 'application/json'
  //   });
  //
  //   return this.http
  //     .post(this.heroesUrl, JSON.stringify(hero), { headers: headers })
  //     .toPromise()
  //     .then(res => res.json().data)
  //     .catch(this.handleError);
  // }

  // Update existing Hero
  // private put(hero: Hero): Promise<Hero> {
  //   let headers = new Headers();
  //   headers.append('Content-Type', 'application/json');
  //
  //   let url = `${this.heroesUrl}/${hero.id}`;
  //
  //   return this.http
  //     .put(url, JSON.stringify(hero), { headers: headers })
  //     .toPromise()
  //     .then(() => hero)
  //     .catch(this.handleError);
  // }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
