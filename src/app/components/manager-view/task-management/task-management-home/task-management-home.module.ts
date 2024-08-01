import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TaskManagementHomeRoutingModule } from './task-management-home-routing.module';
import { TaskManagementHomeComponent } from './task-management-home.component';


@NgModule({
  declarations: [TaskManagementHomeComponent],
  imports: [
    CommonModule,
    TaskManagementHomeRoutingModule
  ]
})
export class TaskManagementHomeModule { }
