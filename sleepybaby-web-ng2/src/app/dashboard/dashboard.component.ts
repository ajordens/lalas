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
import {Location} from "@angular/common";
import {ActivatedRoute, NavigationEnd, Params, Router} from "@angular/router";

@Component({
  moduleId: module.id,
  selector: 'my-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  currentType: string;
  currentGrouping: string;

  constructor(private location: Location,
              private router: Router,
              private route: ActivatedRoute) {
    router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.route.params.forEach((params: Params) => {
          if (params['type'] !== undefined) {
            this.currentType = params['type'];
          }
          if (params['grouping'] !== undefined) {
            this.currentGrouping = params['grouping'];
          }
        });
      }
    });
  }
}
