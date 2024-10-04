import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TaskManagementHomeRoutingModule } from './task-management-home-routing.module';
import { TaskManagementHomeComponent } from './task-management-home.component';
import { SharedModulesModule } from '../../../shared/shared-modules/shared-modules.module';
import { ViewVisitsComponent } from '../view-visits/view-visits.component';
import { ViewSalesComponent } from '../view-sales/view-sales.component';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { FullCalendarModule } from '@fullcalendar/angular';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioButton, MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDivider } from '@angular/material/divider';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import {MatTabsModule} from '@angular/material/tabs';
import { MatSortModule } from '@angular/material/sort';

@NgModule({
  declarations: [
    TaskManagementHomeComponent,
    ViewVisitsComponent,
    ViewSalesComponent, 

  ],
  imports: [
    CommonModule,
    TaskManagementHomeRoutingModule,
    MatTabsModule,
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
    MatSelectModule,
    MatRadioButton,
    MatRadioModule,
    MatDatepickerModule,
    MatPaginatorModule,
    CommonModule,
    MatInputModule,
    FormsModule,
    MatDivider,
    MatBottomSheetModule,
    MatMenuModule,
    MatBadgeModule,
    MatSelectModule,
    MatSortModule,
  ]
})
export class TaskManagementHomeModule { }
