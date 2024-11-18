import { Component } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { CalendarOptions } from '@fullcalendar/core/index.js';
import dayGridPlugin from '@fullcalendar/daygrid';
import { AttendenceService } from '../../../../shared/services/attendence/attendence.service';
import { HttpParams } from '@angular/common/http';
import { meAPIUtility } from '../../../../shared/site-variables';

@Component({
  selector: 'app-view-calendar',
  templateUrl: './view-calendar.component.html',
  styleUrl: './view-calendar.component.css'
})
export class ViewCalendarComponent {

  constructor(
    private attendenceService: AttendenceService,
    private meUtility: meAPIUtility,
    private bottomSheet: MatBottomSheetRef<ViewCalendarComponent>
  ) { }
  
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin],
    events: [],
  };

  public organizationId!: number

  ngOnInit() {
    this.meUtility.getCommonData().subscribe(
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
      },
      () => {
        this.calendarOptions.events = [];
      }
    );
  }



}
