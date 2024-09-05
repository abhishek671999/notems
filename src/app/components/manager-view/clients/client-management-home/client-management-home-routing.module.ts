import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientManagementHomeComponent } from './client-management-home.component';
import { CustomersComponent } from '../../../shared/customers/customers.component';
import { ProspectsComponent } from '../prospects/prospects.component';

const routes: Routes = [
  {
    path: '',
    component: ClientManagementHomeComponent,
    children: [
      { path: 'customers', component: CustomersComponent },
      { path: 'prospects', component: ProspectsComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientManagementHomeRoutingModule { }
