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
import {Router} from "@angular/router";

import * as _ from "lodash";
import {DiaperAggregate} from "./diaper-aggregate";
import {DiaperService} from "./diaper.service";

@Component({
  moduleId: module.id,
  selector: 'diapers-byDay',
  templateUrl: './diapers-byDay.component.html',
  styleUrls: ['./diapers-byDay.component.scss']
})
export class DiapersByDayComponent implements OnInit {
  days: DiaperAggregate[] = [];
  sortField: string = 'date';
  sortDirection: string = 'desc';

  chartOptions: Object;
  showChart: boolean = false;

  constructor(private router: Router,
              private diaperService: DiaperService) {
  }

  ngOnInit(): void {
    this.diaperService.getDiapersByDay()
      .then(diapers => {
        this.days = diapers;
        this.refresh(diapers);
      });
  }

  sort(field): void {
    let direction;

    if (field === this.sortField) {
      direction = (this.sortDirection == 'desc') ? 'asc' : 'desc';
    } else {
      direction = 'desc';
    }

    this.diaperService.getDiapersByDay()
      .then(diapers => {
        this.days = _.orderBy(diapers, [field], [direction]);
        this.sortField = field;
        this.sortDirection = direction;

        this.refresh(diapers);
      });
  }

  private refresh(diapers): void {
    diapers = _.orderBy(diapers, ['date'], ['asc']);

    this.chartOptions = {
      chart: {
        type: 'line'
      },
      title: {
        text: 'Diapers per Day'
      },
      xAxis: {
        categories: _.map(diapers, 'date')
      },
      yAxis: {
        title: {
          text: 'Volume (ml)'
        }
      },
      series: [
        {data: _.map(diapers, 'diaperCount'), name: 'Diaper Count'}
      ]
    };

    this.showChart = true;
  }
}
