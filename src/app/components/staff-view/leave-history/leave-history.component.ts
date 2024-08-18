import { Component } from '@angular/core';
import { appliedLeaves } from '../../../shared/custom_dtypes/leave';
import { AttendenceService } from '../../../shared/services/attendence/attendence.service';
import { MatDialog } from '@angular/material/dialog';
import { LeaveActionComponent } from '../dialog/leave-action/leave-action.component';

@Component({
  selector: 'app-leave-history',
  templateUrl: './leave-history.component.html',
  styleUrls: ['./leave-history.component.css', './../../../app.component.css']
})
export class LeaveHistoryComponent {

  constructor(
    private attendenceService: AttendenceService,
    private matDialog: MatDialog
  ){}

  public leaveCount: {} = {}
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
}
