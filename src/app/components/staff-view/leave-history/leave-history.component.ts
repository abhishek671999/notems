import { Component } from '@angular/core';
import { appliedLeaves } from '../../../shared/custom_dtypes/leave';
import { AttendenceService } from '../../../shared/services/attendence/attendence.service';
import { MatDialog } from '@angular/material/dialog';
import { LeaveActionComponent } from '../dialog/leave-action/leave-action.component';
import { ApplyLeaveComponent } from '../../manager-view/dialog-box/apply-leave/apply-leave.component';
import { HttpParams } from '@angular/common/http';
import { sessionWrapper } from '../../../shared/site-variables';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ViewCalendarComponent } from '../../shared/bottom-sheet/view-calendar/view-calendar.component';

@Component({
  selector: 'app-leave-history',
  templateUrl: './leave-history.component.html',
  styleUrls: ['./leave-history.component.css', './../../../app.component.css']
})
export class LeaveHistoryComponent {

  constructor(
    private attendenceService: AttendenceService,
    private matDialog: MatDialog,
    private sessionWrapper: sessionWrapper,
    private bottomSheet: MatBottomSheet
  ){}

  public leaveCount: {} = {}
  public leaveTypes: [] = []
  public myAppliedLeavesDataSource: appliedLeaves[] = []
  public myAppliedLeavesTableColumns = ["sl_no", "from_date", "to_date", "status", "type"]
 
  
  ngOnInit(){
    this.fetchMyLeaves()
  }

  fetchMyLeaves(){
    this.attendenceService.getMyLeaves().subscribe((data: any) => {
      this.myAppliedLeavesDataSource = data['leaves']
      this.leaveCount = data['leave_count']
    });
  }

  displayMoreInfo(leave: any) {
    let dialogRef = this.matDialog.open(LeaveActionComponent, { data: {leave: leave} })
    dialogRef.afterClosed().subscribe(
      (data: any) => {
        if(data?.result){
          this.ngOnInit()
        }
      }
    )
  }

  applyLeave() {
    let dialogRef = this.matDialog.open(ApplyLeaveComponent, {
      data: { leaveTypes: this.leaveTypes, leaveCount: this.leaveCount },
    });
  }

  fetchLeaveTypes(){
    let httpParams = new HttpParams();
    httpParams = httpParams.append(
      'organization_id',
      String(this.sessionWrapper.getItem('organization_id'))
    );
    this.attendenceService.getLeaveTypes(httpParams).subscribe(
      (data: any) => {
        this.leaveTypes = data['leave_types'];
      },
      (error: any) => {}
    );
  }

  openCalendar() {
    this.bottomSheet.open(ViewCalendarComponent)
  }
  
}
