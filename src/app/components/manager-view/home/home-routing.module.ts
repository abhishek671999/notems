import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { CustomersComponent } from '../customers/customers.component';
import { ItemsComponent } from '../../shared/items/items.component';
import { TeamManagementComponent } from '../team-management-home/team-management/team-management.component';
import { CalendarComponent } from '../calendar/calendar.component';
import { UserManagementComponent } from '../team-management-home/user-management/user-management.component';
import { ProspectsComponent } from '../clients/prospects/prospects.component';
import { CategoryComponent } from '../../shared/category/category.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: 'items', component: ItemsComponent },
      { path: 'categories', component: CategoryComponent},
      { path: 'team-management', component: TeamManagementComponent },
      { path: 'user-management/:team_id', component: UserManagementComponent },
      { path: 'calendar', component: CalendarComponent },
      { path: 'customers', component: CustomersComponent },
      { path: 'prospects', component: ProspectsComponent },
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
      {
        path: 'attendence',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('./../leave-management/leave-management.module').then(
                (m) => m.LeaveManagementModule
              ),
          },
        ],
      },
      {
        path: 'task',
        children: [
          {
            path: '',
            loadChildren: () =>
              import(
                './../task-management/task-management-home/task-management-home.module'
              ).then((m) => m.TaskManagementHomeModule),
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
