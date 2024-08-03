import { Component } from '@angular/core';
import { AttendenceService } from '../../../shared/services/attendence/attendence.service';
import { MatDialog } from '@angular/material/dialog';
import { ApplyLeaveComponent } from '../../manager-view/dialog-box/apply-leave/apply-leave.component';
import { HttpParams } from '@angular/common/http';
import { sessionWrapper } from '../../../shared/site-variables';
import { leaveType } from '../../../shared/custom_dtypes/attendence';
import { CalendarOptions } from '@fullcalendar/core/index.js';
import dayGridPlugin from '@fullcalendar/daygrid';
import { dateUtils } from '../../../shared/utils/date_utils';
import { Router } from '@angular/router';
import { appliedLeaves } from '../../../shared/custom_dtypes/leave';
import { LeaveActionComponent } from '../dialog/leave-action/leave-action.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ViewCalendarComponent } from '../../shared/bottom-sheet/view-calendar/view-calendar.component';

@Component({
  selector: 'app-attendence',
  templateUrl: './attendence.component.html',
  styleUrl: './attendence.component.css',
})
export class AttendenceComponent {
  constructor(
    private attendenceService: AttendenceService,
    private matDialog: MatDialog,
    private sessionWrapper: sessionWrapper,
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

  public isClockedIn: boolean = false;
  public isClockedOut: boolean = false;
  public currentTime: Date;
  public attendence: any;
  public showCalendar: boolean = false;
  public myAppliedLeavesDataSource: appliedLeaves[] = []
  public myAppliedLeavesTableColumns = ["sl_no", "from_date", "to_date", "status", "type"]

  private LeaveType: leaveType[] | null;
  private intervalId: any;



  ngOnInit() {
    this.intervalId = setInterval(() => {
      this.currentTime = new Date();
    }, 1000);

    let httpParams = new HttpParams();
    httpParams = httpParams.append(
      'organization_id',
      String(this.sessionWrapper.getItem('organization_id'))
    );

    this.attendenceService.getMyLeaves().subscribe((data: any) => {
      this.attendence = data['attendance'];
      this.myAppliedLeavesDataSource = data['leaves']
      console.log('Attendence: ', this.attendence);
      this.isClockedIn = Boolean(this.attendence.punch_in);
    });

    this.attendenceService.getLeaveTypes(httpParams).subscribe(
      (data: any) => {
        this.LeaveType = data['leave_types'];
      },
      (error: any) => {}
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
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        let body = {
          punch_out_location: `${position.coords.latitude},${position.coords.longitude}`,
        };
        this.attendenceService.punchOut(body).subscribe(
          (data: any) => {
            this.attendence.punch_out = this.dateUtils.getStandarizeTimeFormat(this.currentTime);
          },
          (error: any) => {
            alert('Error while clocking out');
          }
        );
      });
    } else {
      alert(
        `Browser doesn't support location service. Please use other browser`
      );
    }
  }

  clockIn() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        let body = {
          punch_in_location: `${position.coords.latitude},${position.coords.longitude}`,
        };
        this.attendenceService.punchIn(body).subscribe(
          () => {
            this.attendence.punch_in = this.dateUtils.getStandarizeTimeFormat(this.currentTime);
          },
          () => {
            alert('Error while clocking in');
          }
        );
      });
    } else {
      alert(
        `Browser doesn't support location service. Please use other browser`
      );
    }
  }

  applyLeave() {
    this.matDialog.open(ApplyLeaveComponent, {
      data: { leaveTypes: this.LeaveType },
    });
  }

  toggleCalendar() {
    this.showCalendar = !this.showCalendar
  }

  navigateToBeats() {
    this.router.navigate(['./staff/beats'])
  }

  displayMoreInfo(leave: any) {
    console.log(leave)
    this.matDialog.open(LeaveActionComponent, { data: {leave: leave} })
  }

  openCalendar() {
    this.bottomSheet.open(ViewCalendarComponent)
  }
}
