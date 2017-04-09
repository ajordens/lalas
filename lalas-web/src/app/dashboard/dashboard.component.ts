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

import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';

import {FeedingService} from "../feeding/feeding.service";
import {FeedingAggregate} from "../feeding/feeding-aggregate";

import {ChartsModule, Color} from 'ng2-charts';

import * as _ from "lodash";

@Component({
  moduleId: module.id,
  selector: 'my-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  days: FeedingAggregate[] = [];
  sortField: string = 'date';
  sortDirection: string = 'desc';

  // lineChart
  public lineChartData: Array<any> = [];
  public lineChartLabels: Array<any> = [];
  public lineChartOptions: any = {
    responsive: false
  };
  public lineChartColors: Array<any> = [
    {
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  public lineChartLegend: boolean = true;
  public lineChartType: string = 'line';
  public showChart: boolean = false;

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

    this.lineChartLabels = _.map(feedings, 'date');
    this.lineChartData = [
      {data: _.map(feedings, 'milkVolumeAverageMilliliters'), label: 'Average Volume (ml)'},
    ];
    this.showChart = true;

    console.log(this.lineChartData);
    console.log(this.lineChartLabels);
  }
}
