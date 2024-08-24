import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { AttendenceComponent } from '../attendence/attendence.component';
import { SharedModulesModule } from '../../../shared/services/shared-modules/shared-modules.module';
import { HomeComponent } from './home.component';
import { MatButtonModule } from '@angular/material/button';
import { FullCalendarModule } from '@fullcalendar/angular';
import { MatTableModule } from '@angular/material/table';
import { LeaveActionComponent } from '../dialog/leave-action/leave-action.component';
import { MatDialogModule } from '@angular/material/dialog';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { BeatsComponent } from '../beats/beats.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { SalesAnalyticsComponent } from '../analytics/sales-analytics/sales-analytics.component';
import { MarketingAnalyticsComponent } from '../analytics/marketing-analytics/marketing-analytics.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { RouterModule } from '@angular/router';
import { SalesComponent } from '../sales/sales.component';
import { MatMenuModule } from '@angular/material/menu';
import { VisitsComponent } from '../visits/visits.component';
import { LeaveHistoryComponent } from '../leave-history/leave-history.component';
import {MatBadgeModule} from '@angular/material/badge';

@NgModule({
  declarations: [
    HomeComponent,
    AttendenceComponent,
    LeaveActionComponent,
    BeatsComponent,
    SalesComponent,
    VisitsComponent,
    SalesAnalyticsComponent,
    MarketingAnalyticsComponent,
    LeaveHistoryComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    MatButtonModule,
    MatTableModule,
    MatDialogModule,
    MatSnackBarModule,
    FullCalendarModule,
    ReactiveFormsModule,
    FormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDialogModule,
    MatInputModule,
    MatDividerModule,
    MatBottomSheetModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatMenuModule,
    RouterModule,
    SharedModulesModule,
    MatBadgeModule
  ]
})
export class HomeModule { }
