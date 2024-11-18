import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { SharedModulesModule } from '../../shared/shared-modules/shared-modules.module';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { MatButtonModule } from '@angular/material/button';
import { AttendenceTrackerComponent } from '../leave-management/attendence-tracker/attendence-tracker.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { CustomersComponent } from '../../shared/customers/customers.component';
import { AddCustomerComponent } from '../../shared/dialog-box/add-customer/add-customer.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditCustomerProspectComponent } from '../dialog-box/edit-customer-prospect/edit-customer-prospect.component';
import { ProspectsComponent } from '../clients/prospects/prospects.component';
import { BeatsComponent } from '../task-management/beats/beats.component';
import { TasksComponent } from '../task-management/tasks/tasks.component';
import { AddBeatComponent } from '../dialog-box/add-beat/add-beat.component';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDivider } from '@angular/material/divider';
import { CalendarComponent } from '../calendar/calendar.component';
import { HolidayComponent } from '../dialog-box/holiday/holiday.component';
import { LeaveComponent } from '../leave-management/leave/leave.component';
import { UserManagementComponent } from '../team-management-home/user-management/user-management.component';
import { TeamManagementComponent } from '../team-management-home/team-management/team-management.component';
import { AddUserToTeamComponent } from '../dialog-box/add-user-to-team/add-user-to-team.component';
import { MatRadioButton, MatRadioModule } from '@angular/material/radio';
import { SalesAnalyticsComponent } from '../analytics/sales-analytics/sales-analytics.component';
import { MarketingAnalyticsComponent } from '../analytics/marketing-analytics/marketing-analytics.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { EditBeatComponent } from '../dialog-box/edit-beat/edit-beat.component';
import { LeaveStatusUpdateComponent } from '../bottom-sheet/leave-status-update/leave-status-update.component';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import {MatMenuModule} from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { AssignBeatsComponent } from '../task-management/assign-beats/assign-beats.component';
import { AssignBeatComponent } from '../dialog-box/assign-beat/assign-beat.component';
import { EditAssignedBeatComponent } from '../dialog-box/edit-assigned-beat/edit-assigned-beat.component';
import { TaskManagementHomeModule } from '../task-management/task-management-home/task-management-home.module';
import { AttendenceMoreInfoComponent } from '../dialog-box/attendence-more-info/attendence-more-info.component';
import { ReimbursementComponent } from '../reimbursement/reimbursement.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ItemWiseAnalyticsComponent } from '../analytics/item-wise-analytics/item-wise-analytics.component';
import { MatSortModule } from '@angular/material/sort';

@NgModule({
  declarations: [
    HomeComponent,
    AttendenceTrackerComponent,
    CustomersComponent,
    ProspectsComponent,
    BeatsComponent,
    AssignBeatsComponent,
    TasksComponent,
    AddCustomerComponent,
    EditCustomerProspectComponent,
    AddBeatComponent,
    EditBeatComponent,
    CalendarComponent,
    ReimbursementComponent,
    HolidayComponent,
    LeaveComponent,
    UserManagementComponent,
    TeamManagementComponent,
    AddUserToTeamComponent,
    SalesAnalyticsComponent,
    MarketingAnalyticsComponent,
    ItemWiseAnalyticsComponent,
    LeaveStatusUpdateComponent,
    AssignBeatComponent,
    AttendenceMoreInfoComponent,
    EditAssignedBeatComponent
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
    TaskManagementHomeModule,
    MatCheckboxModule,
    MatSortModule,
  ],
})
export class HomeModule {}
