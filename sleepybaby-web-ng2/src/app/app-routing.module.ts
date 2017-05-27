import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import {LoginComponent} from "./user/login.component";
import {FeedingsByDayComponent} from "./feeding/feedings-byDay.component";

const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard/feedings/byDay',
    pathMatch: 'full'
  },
  {
    path: 'dashboard/:type/:grouping',
    component: DashboardComponent
  },
  {
    path: 'days/:id',
    component: FeedingsByDayComponent
  },
  {
    path: 'login',
    component: LoginComponent
  }
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
