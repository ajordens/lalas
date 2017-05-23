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
