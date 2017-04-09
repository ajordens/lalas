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
import {ChartsModule} from "ng2-charts";

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpModule,
    ChartsModule
  ],
  declarations: [
    AppComponent,
    FeedingAggregateComponent,
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
