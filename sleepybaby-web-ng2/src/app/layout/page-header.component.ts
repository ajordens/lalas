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

import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {Router} from '@angular/router';
import {UserService} from "../user/user.service";
import {showWarningOnce} from "tslint/lib/error";

@Component({
  moduleId: module.id,
  selector: 'page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.css']
})
export class PageHeaderComponent implements OnInit {
  user: string;
  currentRoute: string = '/default';
  showNav = true;

  constructor(private location: Location,
              private router: Router,
              private userService: UserService) {
    router.events.subscribe((val) => {
      if (location.path() != '') {
        this.currentRoute = location.path();
      }

      this.showNav = location.path() !== '/login';
      if (this.showNav && !this.user) {
        this.ngOnInit();
      }
    });
  }

  ngOnInit(): void {
    this.userService.getCurrent()
      .then(user => {
        if (user) {
          this.user = user.name;
        }
      });
  }
}
