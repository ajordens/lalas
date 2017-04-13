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

import {Component, OnInit, ViewChild} from "@angular/core";
import {FeedingAggregate} from "./feeding-aggregate";
import {Router} from "@angular/router";
import {FeedingService} from "./feeding.service";

import * as _ from "lodash";

@Component({
  moduleId: module.id,
  selector: 'feedings-byDay',
  templateUrl: './feedings-byDay.component.html',
  styleUrls: ['./feedings-byDay.component.scss']
})
export class FeedingsByDayComponent implements OnInit {
  days: FeedingAggregate[] = [];
  sortField: string = 'date';
  sortDirection: string = 'desc';

  chartOptions: Object;
  showChart: boolean = false;

  constructor(private router: Router,
              private feedingService: FeedingService) {
  }

  ngOnInit(): void {
    this.feedingService.getFeedingsByDay()
      .then(feedings => {
        this.days = feedings;
        this.refresh(feedings);
      });
  }

  sort(field): void {
    let direction;

    if (field === this.sortField) {
      direction = (this.sortDirection == 'desc') ? 'asc' : 'desc';
    } else {
      direction = 'desc';
    }

    this.feedingService.getFeedingsByDay()
      .then(feedings => {
        this.days = _.orderBy(feedings, [field], [direction]);
        this.sortField = field;
        this.sortDirection = direction;

        this.refresh(feedings);
      });
  }

  gotoFeedingAggregate(feedingAggregate: FeedingAggregate): void {
    let link = ['/days/', feedingAggregate.date];
    this.router.navigate(link);
  }

  private refresh(feedings): void {
    feedings = _.orderBy(feedings, ['date'], ['asc']);

    this.chartOptions = {
      chart: {
        type: 'line'
      },
      title: {
        text: 'Consumption per Day'
      },
      xAxis: {
        categories: _.map(feedings, 'date')
      },
      yAxis: {
        title: {
          text: 'Volume (ml)'
        }
      },
      series: [
        {data: _.map(feedings, 'milkVolumeAverageMilliliters'), name: 'Average Volume (ml)'}
      ]
    };

    this.showChart = true;
  }
}
