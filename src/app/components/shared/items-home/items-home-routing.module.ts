import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItemsHomeComponent } from './items-home.component';
import { DistributorStockComponent } from './distributor-stock/distributor-stock.component';
import { ItemsComponent } from './items/items.component';

const routes: Routes = [
    {
      path: '',
      component: ItemsHomeComponent,
      children: [
        { path: 'items', component: ItemsComponent },
        { path: 'distributor-items', component: DistributorStockComponent},
      ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItemsHomeRoutingModule { }
