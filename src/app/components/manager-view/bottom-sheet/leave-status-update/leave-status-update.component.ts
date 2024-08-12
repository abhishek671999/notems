import { Component, Inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AttendenceService } from '../../../../shared/services/attendence/attendence.service';

@Component({
  selector: 'app-leave-status-update',
  templateUrl: './leave-status-update.component.html',
  styleUrl: './leave-status-update.component.css'
})
export class LeaveStatusUpdateComponent {


  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private attendenceService: AttendenceService,
    private matbottomSheetRef: MatBottomSheetRef<LeaveStatusUpdateComponent>
  ){
    this.selectedLeaveStatusId = data.status_id
  }
  

  leaveStatus = [
    {id: 0, status: 'Pending'},
    {id: 1, status: 'Approve'},
    {id: 2, status: 'Reject'}
  ]
  public selectedLeaveStatusId: number;


  updateLeave(){
    let body = {
      leave_id: this.data.leave_id,
      new_status: this.selectedLeaveStatusId,
    };
    this.attendenceService.updateLeaveStatus(body).subscribe(
      (data: any) => {
        this.matbottomSheetRef.dismiss()
      },
      (error: any) => {
        alert('Failed to Approve');
      }
    );
  }

}
