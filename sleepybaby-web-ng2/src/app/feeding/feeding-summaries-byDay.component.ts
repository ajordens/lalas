import {Component, OnInit, ViewChild} from "@angular/core";
import {Router} from "@angular/router";
import {FeedingService} from "./feeding.service";

import * as _ from "lodash";
import {FeedingSummary} from "./feeding-summary";

@Component({
  moduleId: module.id,
  selector: 'feedings-byDay',
  templateUrl: './feeding-summaries-byDay.component.html',
  styleUrls: ['./feeding-summaries-byDay.component.scss']
})
export class FeedingSummariesByDayComponent implements OnInit {
  days: FeedingSummary[] = [];
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

  gotoFeedingAggregate(feedingSummary: FeedingSummary): void {
    let link = ['/days/', feedingSummary.date];
    this.router.navigate(link);
  }

  private refresh(feedings): void {
    feedings = _.orderBy(feedings, ['date'], ['asc']);

    let series = [];

    let groupings = _.groupBy(feedings, 'numberOfFeedings');
    _.forEach(groupings, function (value, key) {
        series.push({data: _.map(value, function(v: FeedingSummary) {
          return [_.indexOf(feedings, v), v.milkVolumeAverageMilliliters];
        }), name: key + ' - Average Volume (ml)'})
    });

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
      series: series
    };

    this.showChart = true;
  }
}
