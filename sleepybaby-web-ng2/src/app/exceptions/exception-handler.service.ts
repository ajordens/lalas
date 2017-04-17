import {Injectable} from "@angular/core";
import {Router} from "@angular/router";

@Injectable()
export class ExceptionHandlerService {
  constructor(private router: Router) {
  }

  handleTransportError(error: any): Promise<any> {
    if (error.status === 401) {
      this.router.navigate(['/login']);
      return Promise.reject("Unauthenticated!");
    }

    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
