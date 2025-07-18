import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskManagementHomeComponent } from './task-management-home.component';
import { TasksComponent } from '../tasks/tasks.component';
import { BeatsComponent } from '../beats/beats.component';
import { ViewVisitsComponent } from '../view-visits/view-visits.component';
import { ViewSalesComponent } from '../view-sales/view-sales.component';
import { AssignBeatsComponent } from '../assign-beats/assign-beats.component';

const routes: Routes = [
  {
    path: '',
    component: TaskManagementHomeComponent,
    children: [
      { path: 'tasks', component: TasksComponent },
      { path: 'beats', component: BeatsComponent },
      { path: 'assign-beats', component: AssignBeatsComponent},
      { path: 'view-visits/:beat_id', component: ViewVisitsComponent },
      { path: 'view-sales/:beat_id', component: ViewSalesComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaskManagementHomeRoutingModule { }
