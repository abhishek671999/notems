import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { AttendenceComponent } from '../attendence/attendence.component';
import { BeatsComponent } from '../beats/beats.component';
import { AddVisitComponent } from '../../shared/dialog-box/add-visit/add-visit.component';
import { SalesComponent } from '../sales/sales.component';
import { VisitsComponent } from '../visits/visits.component';
import { LeaveHistoryComponent } from '../leave-history/leave-history.component';


const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: 'attendence', component: AttendenceComponent },
      { path: 'leave-history', component: LeaveHistoryComponent},
      { path: 'beats', component: BeatsComponent },
      { path: 'visit/:beat_id', component: VisitsComponent },
      { path: 'sale/:beat_id', component: SalesComponent },
      {
        path: 'analytics',
        children: [
          {
            path: '',
            loadChildren: () => import('./../analytics/analytics-home/analytics-home.module').
              then((m) => m.AnalyticsHomeModule)
          }
        ]
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
