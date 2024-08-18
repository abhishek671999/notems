import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AttendenceService } from '../../../../shared/services/attendence/attendence.service';
import { ConfirmationBoxComponent } from '../../../shared/dialog-box/confirmation-box/confirmation-box.component';
import { updateLeaveStatus } from '../../../../shared/custom_dtypes/leave';
import { SuccessMsgComponent } from '../../../shared/dialog-box/success-msg/success-msg.component';
import { ErrorMsgComponent } from '../../../shared/dialog-box/error-msg/error-msg.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-leave-action',
  templateUrl: './leave-action.component.html',
  styleUrl: './leave-action.component.css'
})
export class LeaveActionComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private attendenceService: AttendenceService,
    private matDialog: MatDialog,
    private matDialogRef: MatDialogRef<LeaveActionComponent>,
    private matsnackbar: MatSnackBar
  ) { }
  
  leaveState = {
    PENDING: 0,
    APPROVED: 1,
    REJECTED: 2,
    CANCELLED: 3,
  };


  ngOnInit() { }

  cancelLeave() {
    if (this.data.leave.status.toLowerCase() == 'approved') {
      this.matsnackbar.open(`Can't cancel approved request`)
    } else {
      let dialogRef = this.matDialog.open(ConfirmationBoxComponent, { data: { msg: 'Are you sure want to cancel this leave??' } })
      dialogRef.afterClosed().subscribe(
        (data: any) => {
          if (data?.result) {
            let body: updateLeaveStatus = {
              leave_id: this.data.leave.leave_id,
              new_status: this.leaveState.CANCELLED
            }
            this.attendenceService.updateLeaveStatus(body).subscribe(
              (data: any) => {
                this.matDialog.open(SuccessMsgComponent, { data: { msg: 'Leave cancelled succesfully' } })
                this.matDialogRef.close({result: true})
              },
              (error: any) => this.matDialog.open(ErrorMsgComponent, {data: {msg: 'Failed to cancel leave'}})
            )
          }
        },
        (error: any) => console.log(error)
      )
    }


  }
}
