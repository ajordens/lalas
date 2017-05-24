import {Component, OnInit} from "@angular/core";
import {FeedingService} from "./feeding.service";

import * as _ from "lodash";

@Component({
  moduleId: module.id,
  selector: 'feedings-byTime',
  templateUrl: './feeding-summaries-byTime.component.html',
  styleUrls: ['./feeding-summaries-byTime.component.scss']
})
export class FeedingSummariesByTimeComponent implements OnInit {
  feedings: Array<any> = [];

  chartOptions: Object;
  showChart: boolean = false;

  constructor(private feedingService: FeedingService) {
  }

  ngOnInit(): void {
    this.feedingService.getFeedingsByTime()
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
