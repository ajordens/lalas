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

import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';

import {FeedingAggregate} from './feeding-aggregate';
import {FeedingService} from "./feeding.service";

@Component({
  moduleId: module.id,
  selector: 'my-feeding-aggregate',
  templateUrl: './feeding-aggregate.component.html',
  styleUrls: ['./feeding-aggregate.component.css']
})
export class FeedingAggregateComponent implements OnInit {
  @Input() feedingAggregate: FeedingAggregate;
  @Output() close = new EventEmitter();
  error: any;
  navigated = false; // true if navigated here

  constructor(private feedingService: FeedingService,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.params.forEach((params: Params) => {
      if (params['id'] !== undefined) {
        let id = +params['id'];
        this.navigated = true;
        // getDailyFeeding(id);
        this.feedingService.getFeedingsByDay()
          .then(feedings => this.feedingAggregate = feedings[0]);
      }
    });
  }
}
