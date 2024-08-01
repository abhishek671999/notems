import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { SharedModulesModule } from '../../../shared/services/shared-modules/shared-modules.module';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { MatButtonModule } from '@angular/material/button';
import { AttendenceTrackerComponent } from '../attendence-tracker/attendence-tracker.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { CustomersComponent } from '../clients/customers/customers.component';
import { AddCustomerComponent } from '../dialog-box/add-customer/add-customer.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { EditCustomerProspectComponent } from '../dialog-box/edit-customer-prospect/edit-customer-prospect.component';
import { ProspectsComponent } from '../clients/prospects/prospects.component';
import { BeatsComponent } from '../task-management/beats/beats.component';
import { TasksComponent } from '../task-management/tasks/tasks.component';
import { AddBeatComponent } from '../dialog-box/add-beat/add-beat.component';
import { MatSelectModule } from '@angular/material/select';
import { ViewVisitsComponent } from '../task-management/view-visits/view-visits.component';
import { ViewSalesComponent } from '../task-management/view-sales/view-sales.component';

@NgModule({
  declarations: [
    HomeComponent,
    AttendenceTrackerComponent,
    CustomersComponent,
    ProspectsComponent,
    BeatsComponent,
    TasksComponent,
    AddCustomerComponent,
    EditCustomerProspectComponent,
    AddBeatComponent,
    ViewVisitsComponent,
    ViewSalesComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModulesModule,
    RouterModule,
    MatButtonModule,
    FullCalendarModule,
    MatDialogModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatSelectModule
  ],
})
export class HomeModule {}
