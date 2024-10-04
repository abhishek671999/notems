import { Component } from '@angular/core';
import { AttendenceService } from '../../../../shared/services/attendence/attendence.service';
import { HttpParams } from '@angular/common/http';
import { sessionWrapper } from '../../../../shared/site-variables';
import { CalendarOptions } from '@fullcalendar/core'; // useful for typechecking
import dayGridPlugin from '@fullcalendar/daygrid';
import { MatDialog } from '@angular/material/dialog';
import { MapViewComponent } from '../../../shared/dialog-box/map-view/map-view.component';
import { dateUtils } from '../../../../shared/utils/date_utils';
import { AttendenceMoreInfoComponent } from '../../dialog-box/attendence-more-info/attendence-more-info.component';
import { ViewImageComponent } from '../../../shared/dialog-box/view-image/view-image.component';


@Component({
  selector: 'app-attendence-tracker',
  templateUrl: './attendence-tracker.component.html',
  styleUrl: './attendence-tracker.component.css',
})
export class AttendenceTrackerComponent {
  constructor(
    private attendenceService: AttendenceService,
    private sessionWrapper: sessionWrapper,
    private matDialog: MatDialog,
    private dateUtils: dateUtils
  ) {
    this.currentTime = null;
  }
  public isClockedIn: boolean = false;
  public holidayList: [] = [];


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
    'starting_km',
    'ending_km',
    'total_km'
  ];

  attendenceDataSource = [];


  private intervalId: any;
  public currentTime: Date | null;
  public attendenceDate = new Date()

  ngOnInit() {
    this.fetchAttendence()
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

    
  }
  
  fetchAttendence() {
    let httpParams = new HttpParams()
    httpParams = httpParams.append('date', String(this.dateUtils.getStandardizedDateFormate(this.attendenceDate)) )
    this.attendenceService.getTodaysAttendence(httpParams).subscribe(
      (data: any) => {
        this.attendenceDataSource = data['attendance_list'];
      },
      (error: any) => {
        this.attendenceDataSource = [];
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

  openImage(title: string, url: string){
    this.matDialog.open(ViewImageComponent, {data: {title: title, url: url}})
  }
  
}
