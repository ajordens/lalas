import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import {FeedingAggregateComponent} from "./feeding/feeding-aggregate.component";

const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'days/:id',
    component: FeedingAggregateComponent
  },
  // {
  //   path: 'heroes',
  //   component: HeroesComponent
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export const routedComponents = [DashboardComponent/*, HeroesComponent, HeroDetailComponent*/];
