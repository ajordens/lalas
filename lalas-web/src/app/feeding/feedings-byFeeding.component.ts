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
import {FeedingAggregate} from "./feeding-aggregate";
import {Router} from "@angular/router";
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

  constructor(private router: Router,
              private feedingService: FeedingService) {
  }

  ngOnInit(): void {
    this.feedingService.getFeedingsByFeeding()
      .then(feedings => {
        this.feedings = feedings;
        console.log(feedings);
        this.refresh(feedings);
      });
  }

  private refresh(feedings): void {
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
      yAxis: {
        title: {
          text: 'Volume (ml)'
        }
      },
      series: [
        {data: _.map(feedings[0].feedings, 'milkVolumeMilliliters'), name: 'Feeding #1'},
        {data: _.map(feedings[1].feedings, 'milkVolumeMilliliters'), name: 'Feeding #2'},
        {data: _.map(feedings[2].feedings, 'milkVolumeMilliliters'), name: 'Feeding #3'},
        {data: _.map(feedings[3].feedings, 'milkVolumeMilliliters'), name: 'Feeding #4'},
        {data: _.map(feedings[4].feedings, 'milkVolumeMilliliters'), name: 'Feeding #5'},
        {data: _.map(feedings[5].feedings, 'milkVolumeMilliliters'), name: 'Feeding #6'},
        {data: _.map(feedings[6].feedings, 'milkVolumeMilliliters'), name: 'Feeding #7'},
        {data: _.map(feedings[7].feedings, 'milkVolumeMilliliters'), name: 'Feeding #8'},
      ]
    };

    this.showChart = true;
  }
}
