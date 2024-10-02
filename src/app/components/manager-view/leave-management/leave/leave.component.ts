import { Component } from '@angular/core';
import { AttendenceService } from '../../../../shared/services/attendence/attendence.service';
import { leaveType } from '../../../../shared/custom_dtypes/attendence';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { LeaveStatusUpdateComponent } from '../../bottom-sheet/leave-status-update/leave-status-update.component';
import { HttpParams } from '@angular/common/http';
import { PageEvent } from '@angular/material/paginator';

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
  length = 50;
  pageSize = 20;
  pageIndex = 0;
  pageSizeOptions = [20, 50, 100];
  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;


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
    this.fetchLeaves()
  }

  fetchLeaves(){
    let httpParams = new HttpParams()
    httpParams = httpParams.append('offset', this.pageIndex * this.pageSize)
    httpParams = httpParams.append('count', this.pageIndex * this.pageSize + this.pageSize)
    this.attendenceService.getLeaves(httpParams).subscribe(
      (data: any) => {
        this.leaveDataSource = data['leaves'];
      },
      (error) => {
        this.leaveDataSource = [];
      }
    );
  }

  openLeaveStatusBox(row: any){
    let bottomSheetBox = this.matBottomSheet.open(LeaveStatusUpdateComponent, {data: row})
    bottomSheetBox.afterDismissed().subscribe(
      (data: any) => {
        this.ngOnInit()
      }
    )
  }

  handlePageEvent(e: PageEvent) {
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.fetchLeaves();
  } 

}
