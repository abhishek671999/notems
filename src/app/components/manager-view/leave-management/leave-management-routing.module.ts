import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LeaveComponent } from './leave/leave.component';
import { AttendenceTrackerComponent } from './attendence-tracker/attendence-tracker.component';
import { LeaveManagementComponent } from './home/leave-management.component';

const routes: Routes = [
  {
    path: '',
    component: LeaveManagementComponent,
    children: [
      { path: 'leave', component: LeaveComponent },
      { path: 'attendence', component: AttendenceTrackerComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeaveManagementRoutingModule { }
