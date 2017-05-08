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

import {Component} from "@angular/core";
import {Http, RequestOptions, Headers} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {Router} from "@angular/router";

@Component({
  moduleId: module.id,
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  public data = {
    username: '',
    password: ''
  };

  constructor(private http: Http, private router: Router) {
  }

  onSubmit() {
    // let headers = new Headers({'Authorization': 'Basic ' + btoa(this.data.username + ':' + this.data.password)});

    let headers = new Headers({'Content-Type': 'application/json'});

    this.http
      .post('/api/login/jwt', {username: this.data.username, password: this.data.password}, headers)
      .toPromise()
      .then(res => {
        console.log(res.headers.get('Authorization'));
        localStorage.setItem(
          'currentUser',
          JSON.stringify({username: this.data.username, token: res.headers.get('Authorization')})
        );
        this.router.navigate(['/']);
      })
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));

    // this.http
    //   .get('/api/users/me', {'headers': headers})
    //   .toPromise()
    //   .then(res => {
    //     this.router.navigate(['/']);
    //   })
    //   .catch((error: any) => Observable.throw(error.json().error || 'Server error'));


  }
}
