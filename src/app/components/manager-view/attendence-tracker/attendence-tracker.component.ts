import { Component } from '@angular/core';
import { AttendenceService } from '../../../shared/services/attendence/attendence.service';
import { HttpParams } from '@angular/common/http';
import { sessionWrapper } from '../../../shared/site-variables';
import { CalendarOptions } from '@fullcalendar/core'; // useful for typechecking
import dayGridPlugin from '@fullcalendar/daygrid';
import { MatDialog } from '@angular/material/dialog';
import { ApplyLeaveComponent } from '../dialog-box/apply-leave/apply-leave.component';
import { leaveType } from '../../../shared/custom_dtypes/attendence';
import { MapViewComponent } from '../../shared/dialog-box/map-view/map-view.component';

@Component({
  selector: 'app-attendence-tracker',
  templateUrl: './attendence-tracker.component.html',
  styleUrl: './attendence-tracker.component.css',
})
export class AttendenceTrackerComponent {
  constructor(
    private attendenceService: AttendenceService,
    private sessionWrapper: sessionWrapper,
    private matDialog: MatDialog
  ) {
    this.LeaveType = null;
    this.currentTime = null;
  }
  public isClockedIn: boolean = false;
  public holidayList: [] = [];
  public clockInLocation: string = '';

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin],
    events: [],
  };

  leaveState = {
    PENDING: 0,
    APPROVED: 1,
    REJECTED: 2,
    CANCELLED: 3,
  };

  attendenceTableColumn: string[] = [
    'sl_no',
    'date',
    'user',
    'punch_in',
    'punch_out',
  ];
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
  attendenceDataSource = [];
  leaveDataSource = [];

  private LeaveType: leaveType[] | null;
  private intervalId: any;
  public currentTime: Date | null;

  ngOnInit() {
    this.intervalId = setInterval(() => {
      this.currentTime = new Date();
    }, 1000);

    let httpParams = new HttpParams();
    httpParams = httpParams.append(
      'organization_id',
      String(this.sessionWrapper.getItem('organization_id'))
    );
    this.attendenceService.getHolidayList(httpParams).subscribe(
      (data: any) => {
        this.calendarOptions.events = data['holidays'];
      },
      () => {
        this.calendarOptions.events = [];
      }
    );

    // Get my leaves
    this.attendenceService.getMyLeaves().subscribe((data) => {
      console.log('Your leaves are: ', data);
    });

    // get leaves
    this.attendenceService.getLeaves().subscribe(
      (data: any) => {
        this.leaveDataSource = data['leaves'];
      },
      (error) => {
        this.leaveDataSource = [];
      }
    );

    // get leave type
    this.attendenceService.getLeaveTypes(httpParams).subscribe(
      (data: any) => {
        this.LeaveType = data['leave_types'];
      },
      (error: any) => {}
    );

    //get todays attendence
    this.attendenceService.getTodaysAttendence().subscribe(
      (data: any) => {
        this.attendenceDataSource = data['attendance_list'];
      },
      (error: any) => {
        this.attendenceDataSource = [];
      }
    );

    //
  }

  clockOut() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        let body = {
          punch_out_location: `http://maps.google.com?q=${position.coords.latitude},${position.coords.longitude}`,
        };
        this.attendenceService.punchOut(body).subscribe(
          () => {
            this.isClockedIn = false;
          },
          () => {
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
          punch_in_location: `http://maps.google.com?q=${position.coords.latitude},${position.coords.longitude}`,
        };
        this.attendenceService.punchIn(body).subscribe(
          () => {
            this.isClockedIn = true;
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

  openLocationScreen(attendence: any) {
    let location = attendence.split(',');
    this.matDialog.open(MapViewComponent, {
      data: { longitude: location[1], latitude: location[0] },
    });
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }
}
