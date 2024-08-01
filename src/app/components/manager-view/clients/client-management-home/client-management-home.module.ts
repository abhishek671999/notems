import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientManagementHomeRoutingModule } from './client-management-home-routing.module';
import { ClientManagementHomeComponent } from './client-management-home.component';


@NgModule({
  declarations: [ClientManagementHomeComponent],
  imports: [
    CommonModule,
    ClientManagementHomeRoutingModule
  ]
})
export class ClientManagementHomeModule { }
