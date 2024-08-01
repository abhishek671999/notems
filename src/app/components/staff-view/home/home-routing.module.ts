import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { AttendenceComponent } from '../attendence/attendence.component';
import { BeatsComponent } from '../beats/beats.component';
import { AddVisitComponent } from '../add-visit/add-visit.component';
import { AddSaleComponent } from '../add-sale/add-sale.component';


const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: 'attendence', component: AttendenceComponent },
      { path: 'beats', component: BeatsComponent },
      { path: 'add-visit/:beat_id', component: AddVisitComponent },
      { path: 'add-sale/:beat_id', component: AddSaleComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
