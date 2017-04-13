import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import {AppComponent} from './app.component';
import {AppRoutingModule, routedComponents} from './app-routing.module';
import {UserService} from "./user/user.service";
import {FeedingService} from "./feeding/feeding.service";
import {FeedingAggregateComponent} from "./feeding/feeding-aggregate.component";
import {DashboardNavComponent} from "./dashboard/dashboard-nav.component";
import {FeedingsByDayComponent} from "./feeding/feedings-byDay.component";
import {FeedingsByFeedingComponent} from "./feeding/feedings-byFeeding.component";

import { Ng2HighchartsModule } from 'ng2-highcharts';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpModule,
    Ng2HighchartsModule
  ],
  declarations: [
    AppComponent,
    FeedingAggregateComponent,
    FeedingsByDayComponent,
    FeedingsByFeedingComponent,
    DashboardNavComponent,
    routedComponents
  ],
  providers: [
    UserService,
    FeedingService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
