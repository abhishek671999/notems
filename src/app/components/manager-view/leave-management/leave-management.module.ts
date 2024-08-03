import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeaveManagementRoutingModule } from './leave-management-routing.module';
import { LeaveManagementComponent } from './home/leave-management.component';


@NgModule({
  declarations: [
    LeaveManagementComponent
  ],
  imports: [
    CommonModule,
    LeaveManagementRoutingModule
  ]
})
export class LeaveManagementModule { }
