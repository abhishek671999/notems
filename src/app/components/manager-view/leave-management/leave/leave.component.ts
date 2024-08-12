import { Component } from '@angular/core';
import { AttendenceService } from '../../../../shared/services/attendence/attendence.service';
import { leaveType } from '../../../../shared/custom_dtypes/attendence';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { LeaveStatusUpdateComponent } from '../../bottom-sheet/leave-status-update/leave-status-update.component';

@Component({
  selector: 'app-leave',
  templateUrl: './leave.component.html',
  styleUrl: './leave.component.css'
})
export class LeaveComponent {

  constructor(
    private attendenceService: AttendenceService,
    private matBottomSheet: MatBottomSheet
  ){}



  leaveTableColumn: string[] = [
    'sl_no',
    'user',
    'leave_type',
    'from_date',
    'to_date',
    'reason',
    'status',
    'update_status',
  ];
  leaveDataSource = [];

  ngOnInit() {
        // get leaves
      this.attendenceService.getLeaves().subscribe(
        (data: any) => {
          this.leaveDataSource = data['leaves'];
        },
        (error) => {
          this.leaveDataSource = [];
        }
      );
  }

  apporveLeave(leave: any) {

  }

  openLeaveStatusBox(row: any){
    let bottomSheetBox = this.matBottomSheet.open(LeaveStatusUpdateComponent, {data: row})
    bottomSheetBox.afterDismissed().subscribe(
      (data: any) => {
        this.ngOnInit()
      }
    )
  }

}
