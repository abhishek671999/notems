import { HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { meAPIUtility } from '../../../shared/site-variables';
import { AttendenceService } from '../../../shared/services/attendence/attendence.service';
import { CalendarOptions } from '@fullcalendar/core/index.js';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarService } from '../../../shared/services/calendar/calendar.service';
import { MatDialog } from '@angular/material/dialog';
import { HolidayComponent } from '../dialog-box/holiday/holiday.component';
@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent {

  constructor(
    private meUtility: meAPIUtility,
    private attendenceService: AttendenceService,
    private calendarService: CalendarService,
    private matdialog: MatDialog
  ) { }
  
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    dateClick: (args: any) => this.handleDateClick(args),
    events: [],
    weekends: true
  };
  private holidayList: [] = []
  private organizationId!: number;

  ngOnInit() {
    this.meUtility.getOrganization().subscribe(
      (data: any) => {
        this.organizationId = data['organization_id']
        this.fetchHolidayList()
      }
    )
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
        this.holidayList = data['holidays']
      },
      () => {
        this.calendarOptions.events = [];
      }
    );

  }

  handleDateClick(arg: any) {
    let eventsForDate = this.holidayList.filter((event: any) => event.date == arg.dateStr)
    let dialogRef = this.matdialog.open(HolidayComponent, { data: eventsForDate.length > 0 ? eventsForDate[0] : { date: arg.dateStr } })
    dialogRef.afterClosed().subscribe(
      (data: any) => {
        if(data.result) this.ngOnInit()
      }
    )
  }
}
