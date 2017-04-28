import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import {AppComponent} from './app.component';
import {AppRoutingModule, routedComponents} from './app-routing.module';
import {UserService} from "./user/user.service";
import {FeedingService} from "./feeding/feeding.service";
import {FeedingAggregateComponent} from "./feeding/feeding-aggregate.component";
import {FeedingsByDayComponent} from "./feeding/feedings-byDay.component";
import {FeedingsByFeedingComponent} from "./feeding/feedings-byFeeding.component";

import { Ng2HighchartsModule } from 'ng2-highcharts';
import {LoginComponent} from "./user/login.component";
import {ExceptionHandlerService} from "./exceptions/exception-handler.service";
import {PageFooterComponent} from "./layout/page-footer.component";
import {PageHeaderComponent} from "./layout/page-header.component";
import {DiapersByDayComponent} from "./diaper/diapers-byDay.component";
import {DiaperService} from "./diaper/diaper.service";

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
    DiapersByDayComponent,
    LoginComponent,
    PageFooterComponent,
    PageHeaderComponent,
    routedComponents
  ],
  providers: [
    UserService,
    FeedingService,
    DiaperService,
    ExceptionHandlerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
