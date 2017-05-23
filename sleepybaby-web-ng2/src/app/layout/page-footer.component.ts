import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {Router} from '@angular/router';
import {UserService} from "../user/user.service";
import {showWarningOnce} from "tslint/lib/error";

@Component({
  moduleId: module.id,
  selector: 'page-footer',
  templateUrl: './page-footer.component.html',
  styleUrls: ['./page-footer.component.scss']
})
export class PageFooterComponent {
  showFooter = true;

  constructor(private location: Location,
              private router: Router,
              private userService: UserService) {
    router.events.subscribe((val) => {
      this.showFooter = location.path() !== '/login';
    });
  }
}
