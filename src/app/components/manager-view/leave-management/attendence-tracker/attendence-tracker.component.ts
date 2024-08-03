import { Component } from '@angular/core';
import { AttendenceService } from '../../../../shared/services/attendence/attendence.service';
import { HttpParams } from '@angular/common/http';
import { sessionWrapper } from '../../../../shared/site-variables';
import { CalendarOptions } from '@fullcalendar/core'; // useful for typechecking
import dayGridPlugin from '@fullcalendar/daygrid';
import { MatDialog } from '@angular/material/dialog';
import { ApplyLeaveComponent } from '../../dialog-box/apply-leave/apply-leave.component';
import { leaveType } from '../../../../shared/custom_dtypes/attendence';
import { MapViewComponent } from '../../../shared/dialog-box/map-view/map-view.component';

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


  attendenceTableColumn: string[] = [
    'sl_no',
    'date',
    'user',
    'punch_in',
    'punch_out',
  ];

  attendenceDataSource = [];


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
