import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import {AppComponent} from './app.component';
import {AppRoutingModule, routedComponents} from './app-routing.module';
import {UserService} from "./user/user.service";
import {FeedingService} from "./feeding/feeding.service";
import {FeedingsByDayComponent} from "./feeding/feedings-byDay.component";

import { Ng2HighchartsModule } from 'ng2-highcharts';
import {LoginComponent} from "./user/login.component";
import {ExceptionHandlerService} from "./exceptions/exception-handler.service";
import {PageFooterComponent} from "./layout/page-footer.component";
import {PageHeaderComponent} from "./layout/page-header.component";
import {DiaperService} from "./diaper/diaper.service";
import {FeedingSummariesByTimeComponent} from "./feeding/feeding-summaries-byTime";
import {FeedingSummariesByDayComponent} from "./feeding/feeding-summaries-byDay.component";
import {DiaperSummariesByDayComponent} from "./diaper/diaper-summaries-byDay.component";

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
    FeedingsByDayComponent,
    FeedingSummariesByTimeComponent,
    FeedingSummariesByDayComponent,
    FeedingsByDayComponent,
    DiaperSummariesByDayComponent,
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
