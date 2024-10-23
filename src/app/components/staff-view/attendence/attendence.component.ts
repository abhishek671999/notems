import { Component } from '@angular/core';
import { AttendenceService } from '../../../shared/services/attendence/attendence.service';
import { MatDialog } from '@angular/material/dialog';
import { ApplyLeaveComponent } from '../../manager-view/dialog-box/apply-leave/apply-leave.component';
import { HttpParams } from '@angular/common/http';
import { meAPIUtility } from '../../../shared/site-variables';
import { leaveType } from '../../../shared/custom_dtypes/attendence';
import { CalendarOptions } from '@fullcalendar/core/index.js';
import dayGridPlugin from '@fullcalendar/daygrid';
import { dateUtils } from '../../../shared/utils/date_utils';
import { Router } from '@angular/router';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ViewCalendarComponent } from '../../shared/bottom-sheet/view-calendar/view-calendar.component';
import { MapViewComponent } from '../../shared/dialog-box/map-view/map-view.component';
import { CaptureAttendenceComponent } from '../../shared/dialog-box/capture-attendence/capture-attendence.component';
import { ViewImageComponent } from '../../shared/dialog-box/view-image/view-image.component';
import { AddReimbursementComponent } from '../bottom-sheet/add-reimbursement/add-reimbursement.component';

@Component({
  selector: 'app-attendence',
  templateUrl: './attendence.component.html',
  styleUrl: './attendence.component.css',
})
export class AttendenceComponent {
  constructor(
    private attendenceService: AttendenceService,
    private matDialog: MatDialog,
    private meUtility: meAPIUtility,
    private dateUtils: dateUtils,
    private router: Router,
    private bottomSheet: MatBottomSheet
  ) {
    this.LeaveType = null;
    this.currentTime = new Date();
  }

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin],
    events: [],
  };

  timeFrames = [
    { displayValue: 'Today', actualValue: 'today' },
    { displayValue: 'Yesterday', actualValue: 'yesterday' },
    { displayValue: 'This week', actualValue: 'this_week' },
    { displayValue: 'This month', actualValue: 'this_month' },
    { displayValue: 'Last month', actualValue: 'last_month' },
    { displayValue: 'Last 3 months', actualValue: 'last_3_months' },
    { displayValue: 'Last 6 months', actualValue: 'last_6_months' },
    { displayValue: 'This year', actualValue: 'this_year' },
    { displayValue: 'Calendar', actualValue: 'custom' },
  ];
  public selectedTimeFrame = this.timeFrames[0].actualValue
  public selectedFromDate: Date | undefined
  public selectedToDate: Date | undefined

  public isClockedIn: boolean = false;
  public isClockedOut: boolean = false;
  public currentTime: Date;
  public attendence: any;
  public showCalendar: boolean = false;
  
  public attendenceRecordsDataSource: [] = []
  public attendenceRecordsTableColumns: string[] = ['sl_no', 'date', 'punch_in', 'punch_out', 'starting_km', 'ending_km', 'total_km']

  public reimbursementDataSource: any[] = []
  public reimbursementTableColumns: string[] = ['sl_no', 'amount', 'reason', 'image']

  private LeaveType: leaveType[] | null;
  private intervalId: any
  private LeaveCount: {} = {}
  private organizationId!: number;

  ngOnInit() {
    this.meUtility.getCommonData().subscribe(
      (data: any) => {
        this.organizationId = data['organization_id']
        this.fetchLeaveType()
        this.fetchHolidayList()
      }
    )
    this.fetchMyAttendenceRecords()

    this.intervalId = setInterval(() => {
      this.currentTime = new Date();
    }, 1000);
  }

  fetchMyLeave(){
    this.attendenceService.getMyLeaves().subscribe((data: any) => {
      this.attendence = data['attendance'];
      this.LeaveCount = data['leave_count']
      this.isClockedIn = Boolean(this.attendence.punch_in);
    });
  }

  fetchLeaveType(){
    let httpParams = new HttpParams();
    httpParams = httpParams.append(
      'organization_id',
      String(this.organizationId)
    );
    this.attendenceService.getLeaveTypes(httpParams).subscribe(
      (data: any) => {
        this.LeaveType = data['leave_types'];
      },
      (error: any) => {}
    );
  }

  fetchHolidayList(){
    let httpParams = new HttpParams();
    httpParams = httpParams.append(
      'organization_id',
      String(this.organizationId)
    );
    this.attendenceService.getHolidayList(httpParams).subscribe(
      (data: any) => {
        this.calendarOptions.events = data['holidays'];
      },
      () => {
        this.calendarOptions.events = [];
      }
    );
  }

  clockOut() {
    let captureAttendenceRef = this.matDialog.open(CaptureAttendenceComponent, {
      disableClose: true, data: {clockOut: true}
    })
    captureAttendenceRef.afterClosed().subscribe(
      (data: any) => {
        if(data?.result){
          this.attendence.punch_out = this.dateUtils.getStandarizeTimeFormat(this.currentTime);
          this.ngOnInit()
        }
      }
    )
  }

  clockIn() {
    let captureAttendenceRef = this.matDialog.open(CaptureAttendenceComponent, {
      disableClose: true, data: {clockIn: true}
    })
    captureAttendenceRef.afterClosed().subscribe(
      (data: any) => {
        if(data?.result){
          this.attendence.punch_in = this.dateUtils.getStandarizeTimeFormat(this.currentTime);
          this.ngOnInit()
        }
      }
    )
  }

  applyLeave() {
    let dialogRef = this.matDialog.open(ApplyLeaveComponent, {
      data: { leaveTypes: this.LeaveType, leaveCount: this.LeaveCount },
    });
  }

  toggleCalendar() {
    this.showCalendar = !this.showCalendar
  }

  navigateToBeats() {
    this.router.navigate(['./staff/beats'])
  }

  openReimbursement(){
    let matbottomSheetRef = this.bottomSheet.open(AddReimbursementComponent)
    matbottomSheetRef.afterDismissed().subscribe(
      (data: any) => {
        console.log(data)
        if(data?.result){
          this.ngOnInit()
        }
      }
    )
  }


  openCalendar() {
    this.bottomSheet.open(ViewCalendarComponent)
  }

  fetchMyAttendenceRecords(){
    let httpParams = new HttpParams()
    httpParams = httpParams.append('time_frame', this.selectedTimeFrame)
    if(this.selectedTimeFrame == 'custom') {
      httpParams = httpParams.append('start_date', String(this.dateUtils.getStandardizedDateFormate(this.selectedFromDate)))
      httpParams = httpParams.append('end_date', String(this.dateUtils.getStandardizedDateFormate(this.selectedToDate)) )
    }
    if((this.selectedTimeFrame != 'custom') || (this.selectedTimeFrame == 'custom' && this.selectedFromDate && this.selectedToDate)){
      this.attendenceService.getMyAttendence(httpParams).subscribe(
        (data: any) => {
          let reimbusermentList: any[] = []
          this.attendenceRecordsDataSource = data['attendance_list']
          this.reimbursementDataSource = data['reimbursement_list']
        },
        (error: any) => {
          alert('Failed to fetch attendnece')
        }
      )
    }
  }

  openLocationScreen(attendence: any) {
    let location = attendence.split(',');
    this.matDialog.open(MapViewComponent, {
      data: { longitude: location[1], latitude: location[0] },
    });
  }

  openImage(title: string, url: string){
    this.matDialog.open(ViewImageComponent, {data: {title: title, url: url}})
  }
}
