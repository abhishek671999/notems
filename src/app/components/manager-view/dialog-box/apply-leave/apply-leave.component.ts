import { Component, Inject } from '@angular/core';
import { AttendenceService } from '../../../../shared/services/attendence/attendence.service';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogContent,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import {
  MAT_DATE_LOCALE,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { leaveType } from '../../../../shared/custom_dtypes/attendence';
import { dateUtils } from '../../../../shared/utils/date_utils';
import { MatInputModule } from '@angular/material/input';
import { meAPIUtility } from '../../../../shared/site-variables';
import { SuccessMsgComponent } from '../../../shared/dialog-box/success-msg/success-msg.component';
import { ErrorMsgComponent } from '../../../shared/dialog-box/error-msg/error-msg.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-apply-leave',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatDatepickerModule,
    MatDialogActions,
    MatDialogContent,
    MatButtonModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    CommonModule
  ],
  providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
  ],
  templateUrl: './apply-leave.component.html',
  styleUrl: './apply-leave.component.css',
})
export class ApplyLeaveComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private attendenceService: AttendenceService,
    private dateUtils: dateUtils,
    private meUtility: meAPIUtility,
    private matDialog: MatDialog,
    private matdialogRef: MatDialogRef<ApplyLeaveComponent>
  ) {
    this.leaveTypes = data.leaveTypes;
  }
  public leaveTypes: [leaveType];
  readonly leaveForm = new FormGroup({
    start: new FormControl<Date | null>(null, Validators.required),
    end: new FormControl<Date | null>(null, Validators.required),
    leaveTypeId: new FormControl<number | null>(null, Validators.required),
    reason: new FormControl<string | null>(''),
  });
  public organizationId!: number;

  ngOnInit() {
    this.meUtility.getCommonData().subscribe(
      (data: any) => {
      this.organizationId = data['organization_id']
      }
    )
  }

  applyLeave() {
    let body = {
      from_date: this.dateUtils.getStandardizedDateFormate(
        this.leaveForm.value.start
      ),
      to_date: this.dateUtils.getStandardizedDateFormate(
        this.leaveForm.value.end
      ),
      reason: this.leaveForm.value.reason,
      type_id: this.leaveForm.value.leaveTypeId,
      organization_id: this.organizationId,
    };
    this.attendenceService.applyLeave(body).subscribe(
      (data: any) => {
        this.matDialog.open(SuccessMsgComponent, {
          data: { msg: 'Leave applied successfully' },
        });
        this.matdialogRef.close({result: true});
      },
      (error: any) => {
        this.matDialog.open(ErrorMsgComponent, {
          data: { msg: error.error.description },
        });
      }
    );
  }
}
