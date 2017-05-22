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

import {Component, OnInit} from "@angular/core";
import {FeedingService} from "./feeding.service";

import * as _ from "lodash";

@Component({
  moduleId: module.id,
  selector: 'feedings-byFeeding',
  templateUrl: './feedings-byFeeding.component.html',
  styleUrls: ['./feedings-byFeeding.component.scss']
})
export class FeedingsByFeedingComponent implements OnInit {
  feedings: Array<any> = [];

  chartOptions: Object;
  showChart: boolean = false;

  constructor(private feedingService: FeedingService) {
  }

  ngOnInit(): void {
    this.feedingService.getFeedingsByFeeding()
      .then(feedings => {
        this.feedings = feedings;

        if (feedings && feedings.length > 0) {
          this.refresh(feedings);
        }
      });
  }

  private refresh(feedings): void {
    let series = [];

    feedings.forEach(function (feeding, i) {
      series.push({
        data: _.map(feeding.feedings, 'milkVolumeMilliliters'),
        name: 'Feeding #' + (i + 1),
        visible: feeding.current
      });
    });

    series.push({
      data: _.map(feedings[0].feedings, 'milkVolumeTotalMilliliters'),
      name: 'Overall',
      yAxis: 1
    });

    this.chartOptions = {
      chart: {
        type: 'line'
      },
      title: {
        text: 'Consumption per Feeding'
      },
      xAxis: {
        categories: _.map(feedings[0].feedings, 'date')
      },
      yAxis: [{
        title: {
          text: 'Volume (ml)'
        }
      }, {
        title: {
          text: 'Total Volume (ml)'
        },
        opposite: true
      }],
      series: series
    };

    this.showChart = true;
  }
}
