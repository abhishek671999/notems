import { Component } from '@angular/core';
import { AttendenceService } from '../../../../shared/services/attendence/attendence.service';

@Component({
  selector: 'app-leave',
  templateUrl: './leave.component.html',
  styleUrl: './leave.component.css'
})
export class LeaveComponent {

  constructor(
    private attendenceService: AttendenceService

  ){}

  leaveState = {
    PENDING: 0,
    APPROVED: 1,
    REJECTED: 2,
    CANCELLED: 3,
  };

  leaveTableColumn: string[] = [
    'sl_no',
    'user',
    'leave_type',
    'from_date',
    'to_date',
    'reason',
    'approve',
    'reject',
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
    let body = {
      leave_id: leave.leave_id,
      new_status: this.leaveState.APPROVED,
    };
    this.attendenceService.updateLeaveStatus(body).subscribe(
      (data: any) => {
        leave.status = 'Approved';
      },
      (error: any) => {
        alert('Failed to Approve');
      }
    );
  }

  rejectLeave(leave: any) {
    let body = {
      leave_id: leave.leave_id,
      new_status: this.leaveState.REJECTED,
    };
    this.attendenceService.updateLeaveStatus(body).subscribe(
      (data: any) => {
        leave.status = 'Rejected';
      },
      (error: any) => {
        alert('Failed to Reject');
      }
    );
  }
}
