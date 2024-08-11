import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { AttendenceComponent } from '../attendence/attendence.component';
import { BeatsComponent } from '../beats/beats.component';
import { AddVisitComponent } from '../add-visit/add-visit.component';
import { AddSaleComponent } from '../../shared/dialog-box/add-sale/add-sale.component';
import { SalesComponent } from '../../manager-view/sales/sales.component';


const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: 'attendence', component: AttendenceComponent },
      { path: 'beats', component: BeatsComponent },
      { path: 'visit/:beat_id', component: AddVisitComponent },
      { path: 'sales/:beat_id', component: SalesComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
