import {Component} from "@angular/core";
import {Location} from "@angular/common";
import {ActivatedRoute, NavigationEnd, Params, Router} from "@angular/router";

@Component({
  moduleId: module.id,
  selector: 'my-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  currentType: string;
  currentGrouping: string;

  constructor(private location: Location,
              private router: Router,
              private route: ActivatedRoute) {
    router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.route.params.forEach((params: Params) => {
          if (params['type'] !== undefined) {
            this.currentType = params['type'];
          }
          if (params['grouping'] !== undefined) {
            this.currentGrouping = params['grouping'];
          }
        });
      }
    });
  }
}
