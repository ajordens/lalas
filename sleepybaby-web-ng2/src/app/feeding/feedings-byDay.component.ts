import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';

import {FeedingService} from "./feeding.service";
import {FeedingSummary} from "./feeding-summary";

@Component({
  moduleId: module.id,
  selector: 'my-feeding-aggregate',
  templateUrl: './feedings-byDay.component.html',
  styleUrls: ['./feedings-byDay.component.scss']
})
export class FeedingsByDayComponent implements OnInit {
  @Input() feedingSummary: FeedingSummary;
  @Output() close = new EventEmitter();
  error: any;
  navigated = false; // true if navigated here

  constructor(private feedingService: FeedingService,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.params.forEach((params: Params) => {
      if (params['id'] !== undefined) {
        let id = params['id'];
        this.navigated = true;
        // should be getFeedingSummary(id)
        this.feedingService.getFeedingsForDay(id)
          .then(feedingSummary => {
            this.feedingSummary = feedingSummary;
          });
      }
    });
  }
}
