import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { MarketingComponent } from '../marketing/marketing.component';
import { SalesComponent } from '../sales/sales.component';
import { AttendenceTrackerComponent } from '../attendence-tracker/attendence-tracker.component';
import { AnalyticsComponent } from '../analytics/analytics.component';
import { CustomersComponent } from '../clients/customers/customers.component';
import { ItemsComponent } from '../../shared/items/items.component';
import { TeamManagementComponent } from '../team-management/team-management.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: 'marketing', component: MarketingComponent },
      { path: 'sales', component: SalesComponent },
      { path: 'attendence', component: AttendenceTrackerComponent },
      { path: 'analytics', component: AnalyticsComponent },
      { path: 'items', component: ItemsComponent },
      { path: 'team-management', component: TeamManagementComponent},
      {
        path: 'client',
        children: [
          {
            path: '',
            loadChildren: () => import('./../clients/client-management-home/client-management-home.module').then(m => m.ClientManagementHomeModule)
          }
        ]
      },
      {
        path: 'task',
        children: [
          {
            path: '',
            loadChildren: () => import('./../task-management/task-management-home/task-management-home.module').then(m => m.TaskManagementHomeModule)
          }
        ]
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
