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
import { AddSaleComponent } from '../add-sale/add-sale.component';
import { AddVisitComponent } from '../add-visit/add-visit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import {
  MatBottomSheet,
  MatBottomSheetModule,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';

@NgModule({
  declarations: [
    HomeComponent,
    AttendenceComponent,
    LeaveActionComponent,
    BeatsComponent,
    AddSaleComponent,
    AddVisitComponent,
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModulesModule,
    MatButtonModule,
    MatTableModule,
    MatDialogModule,
    MatSnackBarModule,
    FullCalendarModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDialogModule,
    MatInputModule,
    MatDividerModule,
    MatBottomSheetModule
  ]
})
export class HomeModule { }
