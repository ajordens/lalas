import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';

import {FeedingAggregate} from './feeding-aggregate';
import {FeedingService} from "./feeding.service";

@Component({
  moduleId: module.id,
  selector: 'my-feeding-aggregate',
  templateUrl: './feeding-aggregate.component.html',
  styleUrls: ['./feeding-aggregate.component.css']
})
export class FeedingAggregateComponent implements OnInit {
  @Input() feedingAggregate: FeedingAggregate;
  @Output() close = new EventEmitter();
  error: any;
  navigated = false; // true if navigated here

  constructor(private feedingService: FeedingService,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.params.forEach((params: Params) => {
      if (params['id'] !== undefined) {
        let id = +params['id'];
        this.navigated = true;
        // getDailyFeeding(id);
        this.feedingService.getFeedingsByDay()
          .then(feedings => this.feedingAggregate = feedings[0]);
      }
    });
  }
}
