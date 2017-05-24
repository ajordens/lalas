import {Component, OnInit, ViewChild} from "@angular/core";
import {Router} from "@angular/router";

import * as _ from "lodash";
import {DiaperService} from "./diaper.service";
import {DiaperSummary} from "./diaper-summary";

@Component({
  moduleId: module.id,
  selector: 'diapers-byDay',
  templateUrl: './diaper-summaries-byDay.component.html',
  styleUrls: ['./diaper-summaries-byDay.component.scss']
})
export class DiaperSummariesByDayComponent implements OnInit {
  days: DiaperSummary[] = [];
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
