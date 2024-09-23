import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomersComponent } from '../customers/customers.component';
import { HomeComponent } from '../home/home.component';
import { ReceiptsComponent } from '../receipts/receipts.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: 'customers', component: CustomersComponent },
      { path: 'receipt', component: ReceiptsComponent}
    ]
  }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SharedModulesRoutingModule { }
