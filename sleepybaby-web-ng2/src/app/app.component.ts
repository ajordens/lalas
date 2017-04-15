import {Component, OnInit} from '@angular/core';
import {UserService} from "./user/user.service";

@Component({
  moduleId: module.id,
  selector: 'my-app',
  template: `
<dashboard-nav></dashboard-nav>
<div class="main">
  <div class="container">
    <!--<nav>-->
      <!--<a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>-->
      <!--<a routerLink="/heroes" routerLinkActive="active">Heroes</a>-->
    <!--</nav>-->
    <router-outlet></router-outlet>
  </div>
</div>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
}
