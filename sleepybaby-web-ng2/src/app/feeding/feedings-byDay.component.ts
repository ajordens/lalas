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
