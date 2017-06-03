import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';

import {FeedingService} from "./feeding.service";
import {FeedingSummary} from "./feeding-summary";
import * as _ from "lodash";

@Component({
  moduleId: module.id,
  selector: 'my-feeding-aggregate',
  templateUrl: './feedings-byDay.component.html',
  styleUrls: ['./feedings-byDay.component.scss']
})
export class FeedingsByDayComponent implements OnInit {
  @Input() feedingSummary: FeedingSummary;
  chartOptions: Object;
  showChart: boolean;

  constructor(private feedingService: FeedingService,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.params.forEach((params: Params) => {
      if (params['id'] !== undefined) {
        let id = params['id'];
        // should be getFeedingSummary(id)
        this.feedingService.getFeedingsForDay(id)
          .then(feedingSummary => {
            this.feedingSummary = feedingSummary;

            this.chartOptions = {
              chart: {
                type: 'line'
              },
              title: {
                text: 'Consumption per Feeding'
              },
              xAxis: {
                categories: _.map(feedingSummary.feedings, 'time')
              },
              yAxis: {
                title: {
                  text: 'Volume (ml)'
                },
                min: 0
              },
              series: [
                {data: _.map(feedingSummary.feedings, 'milkVolumeMilliliters'), name: 'Volume (ml)'}
              ]
            };

            this.showChart = true;

          });
      }
    });
  }
}
