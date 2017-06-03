import {Component, OnInit} from "@angular/core";
import {FeedingService} from "./feeding.service";

import * as _ from "lodash";
import {Feeding} from "./feeding";

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
        data: _.map(feeding.feedings, function (feeding: Feeding, i) {
          return {
            x: i,
            y: feeding.milkVolumeMilliliters,
            'feeding': feeding
          }
        }),
        name: 'Feeding #' + (i + 1),
        visible: feeding.current
      });
    });

    // experiment with a different type of plot ( ... maybe a bar chart?)
    series.push({
      data: _.map(feedings[0].feedings, 'milkVolumeAverageMilliliters'),
      name: 'Daily Average',
      yAxis: 0
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
      }],
      tooltip: {
        formatter: function () {
          let time = function(data, x) {
            return (<FeedingPoint> _.find(data, {category: x})).feeding.time;
          };

          if (this.series.data[0].feeding) {
            return '<b>' + this.y + 'ml</b> at <b>' + time(this.series.data, this.x) + '</b> (' + this.series.name + ')';
          }

          return '<b>' + this.y + 'ml</b> (' + this.series.name + ')';
        }
      },
      series: series
    };

    this.showChart = true;
  }
}

interface FeedingPoint {
  category: number;
  feeding: Feeding;
}
